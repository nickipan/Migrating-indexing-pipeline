from os import path
from time import sleep
from kubernetes import client, config
import json
import datetime, re
from dateutil.tz import tzutc, tzlocal
# import collections
# collections.Callable = collections.abc.Callable


# Sources:
# - https://medium.com/@aris.david/how-to-create-a-job-using-kubernetes-python-client-ed00ac2b791d
# - https://github.com/kubernetes-client/python/blob/master/examples/job_crud.py


class JobControl:

    def __init__(self):

        config.load_incluster_config()

        self.core_v1 = client.CoreV1Api();
        self.batch_v1 = client.BatchV1Api()


    @staticmethod
    def create_container(name, args):

        env = [client.V1EnvVar(name="DATA_DIR", value="/app/data"),
               client.V1EnvVar(name="ELASTICSEARCH_HOST", value="https://amy.lab.uvalight.net/es-devops/"),
               client.V1EnvVar(name="ELASTICSEARCH_USERNAME", value="elastic"),
               client.V1EnvVar(name="ELASTICSEARCH_PASSWORD", value="tgerYmYN3r6PwudtrTJ0h8IxY"),
               client.V1EnvVar(name="KAGGLE_USERNAME", value="norasilven"),
               client.V1EnvVar(name="KAGGLE_KEY", value="ac7ddd5e827b32ba94901f5f66a17094"),
               client.V1EnvVar(name="GITHUB_API_TOKEN", value="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")]

        container = client.V1Container(
            image="qcdis/kb-indexer:latest",
            name=name,
            command=["kb_indexer"],
            args=(args+["pipeline"]),
            env=env
        )

        return container


    @staticmethod
    def create_pod_template(name, container):

        pod_template = client.V1PodTemplateSpec(
            spec=client.V1PodSpec(restart_policy="Never", containers=[container]),
            metadata=client.V1ObjectMeta(name=name, labels={"app.kubernetes.io/name" : name})
        )

        return pod_template


    @staticmethod
    def create_job(name, template):

        metadata = client.V1ObjectMeta(name=name, namespace="kms")

        job = client.V1Job(
            api_version="batch/v1",
            kind="Job",
            metadata=metadata,
            spec=client.V1JobSpec(template=template)
        )

        return job


    @staticmethod
    def create_cronjob(name, job, period):

        metadata = client.V1ObjectMeta(name=name, namespace="kms")
        schedule = "@monthly"
        t = datetime.datetime.now()

        if period == "daily":
            schedule = str(t.minute + 1) + " " + str(t.hour) + " * * *"
        elif period == "weekly":
            d = (datetime.datetime.weekday(t) + 1) % 7
            schedule = str(t.minute + 1) + " " + str(t.hour) + " * * " + str(d)
        elif period == "monthly":
            schedule = str(t.minute + 1) + " " + str(t.hour) + " " + str(t.day) + " * *"

        template = client.V1JobTemplateSpec(metadata=job.metadata, spec=job.spec)
        spec = client.V1CronJobSpec(schedule=schedule, job_template=template)

        cronjob = client.V1CronJob(
            api_version="batch/v1",
            kind="CronJob",
            metadata=metadata,
            spec=spec
        )

        return cronjob


    def run_job(self, job):

        response = self.batch_v1.create_namespaced_job(
            body=job,
            namespace="kms")

        return self.process_job_status(response.status, response.metadata.name)


    def run_cronjob(self, cronjob):

        response = self.batch_v1.create_namespaced_cron_job(
            body=cronjob,
            namespace="kms"
        )

        return self.process_cronjob_status(response.status, response.metadata.name)


    def get_job_status(self, name):

        response = self.batch_v1.read_namespaced_job_status(
            name=name,
            namespace="kms",
        )

        return self.process_job_status(response.status, name)


    def get_cronjob_status(self, name):

        response = self.batch_v1.read_namespaced_cron_job_status(
            name=name,
            namespace="kms"
        )

        return self.process_cronjob_status(response.status, name)


    def update_job(self, name, job):

        response = self.batch_v1.patch_namespaced_job(
            name=name,
            namespace="kms",
            body=job
        )

        return self.process_job_status(response.status, name)


    def update_cronjob(self, name, cronjob):

        response = self.batch_v1.patch_namespaced_cron_job(
            name=name,
            namespace="kms",
            body=cronjob
        )

        return self.process_cronjob_status(response.status, name)


    def delete_job(self, name):

        response = self.batch_v1.delete_namespaced_job(
            name=name,
            namespace="kms",
            body=client.V1DeleteOptions(
                propagation_policy='Foreground',
                grace_period_seconds=5)
        )

        return self.process_job_status(response.status, name)


    def delete_cronjob(self, name):

        response = self.batch_v1.delete_namespaced_cron_job(
            name=name,
            namespace="kms",
            body=client.V1DeleteOptions(
                propagation_policy='Foreground',
                grace_period_seconds=5)
        )

        return self.process_cronjob_status(response.status, name)


    def get_jobs(self):

        jobs = self.batch_v1.list_namespaced_job(
            namespace="kms"
        )

        status_list = [ self.process_job_status(i.status, i.metadata.name) for i in jobs.items ]
        return status_list


    def get_cronjobs(self):

        cronjobs = self.batch_v1.list_namespaced_cron_job(
            namespace="kms"
        )

        status_list = [ self. process_cronjob_status(i.status, i.metadata.name) for i in cronjobs.items ]
        return status_list


    @staticmethod
    def process_job_status(status, name):

        status_string = str(status)

        # Replace datetime objects with string
        datetime_pat = re.compile(r'datetime\.datetime\([\d, ]+[a-zA-Z()]+=[a-zA-Z()]+\)')
        ex = datetime_pat.findall(status_string)
        count = 1
        for date in ex:
            st = str(eval(date))
            status_string = datetime_pat.sub('"' + st + '"', status_string, count)
            count += 1
        
        status_string = status_string.replace("'", '"')
        status_string = status_string.replace("None", '"None"')
        status_map = json.loads(status_string)
        status_map['name'] = name
        return status_map


    def process_cronjob_status(self, status, name):

        status_map = self.process_job_status(status, name)
        if ('active' in status_map) and (status_map['active'] != "None"):
            last_job = status_map['active'][-1]
            last_job_response = self.batch_v1.read_namespaced_job_status(
                name=last_job['name'],
                namespace="kms"
            )

            last_job_status = last_job_response.status
            last_status_map = self.process_job_status(last_job_status, name)

            if 'lastSuccessfulTime' in status_map:
                last_status_map['last_successful_time'] = status_map['lastSuccessfulTime']

            return last_status_map
        else:
            return status_map

