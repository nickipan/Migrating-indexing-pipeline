from os import path
from time import sleep
from kubernetes import client, config


# Sources:
# - https://medium.com/@aris.david/how-to-create-a-job-using-kubernetes-python-client-ed00ac2b791d
# - https://github.com/kubernetes-client/python/blob/master/examples/job_crud.py


class JobControl:

    def __init__(self):

        config.load_incluster_config()

        self.core_v1 = client.CoreV1Api();
        self.batch_v1 = client.BatchV1Api()


    @staticmethod
    def create_container(image, name, pull_policy, args, command):

        container = client.V1Container(
            image=image,
            name=name,
            image_pull_policy=pull_policy,
            args=[args],
            command=[command]
        )

        return container


    @staticmethod
    def create_pod_template(pod_name, container):

        pod_template = client.V1PodTemplateSpec(
            spec=client.V1PodSpec(restart_policy="Never", containers=[container]),
            metadata=client.V1ObjectMeta(name=pod_name, labels={"pod_name" : pod_name})
        )

        return pod_template


    @staticmethod
    def create_job(job_name, pod_template):

        metadata = client.V1ObjectMeta(name=job_name, labels={"job_name" : job_name})

        job = client.V1Job(
            api_version="batch/v1",
            kind="Job",
            metadata=metadata,
            spec=client.V1JobSpec(backoff_limit=0, template=pod_template)
        )

        return job


    def run_job(self, job, namespace):

        response = self.batch_v1.create_namespaced_job(
            body=job,
            namespace=namespace)

        return response.status


    def get_job_status(self, job_name, namespace):

        job_completed = False
        while not job_completed:
            response = self.batch_v1.read_namespaced_job_status(
                name=job_name,
                namespace=namespace)
            if response.status.succeeded is not None or response.status.failed is not None:
                job_completed = True
            sleep(1)


    def update_job(self, job, job_name, image, namespace):

        job.spec.template.spec.containers[0].image = image
        response = self.batch_v1.patch_namespaced_job(
            name=job_name,
            namespace=namespace,
            body=job)


    def delete_job(self, job_name, namespace):

        response = self.batch_v1.delete_namespaced_job(
        name=job_name,
        namespace=namespace,
        body=client.V1DeleteOptions(
            propagation_policy='Foreground',
            grace_period_seconds=5))
