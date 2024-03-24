from functools import reduce

import os
from dotenv import load_dotenv
import tempfile
from functools import reduce
from kubernetes import client, config
from swagger_server.utils.JobControl import *
from flask import request, jsonify

load_dotenv()

auth = os.getenv('GITHUB_TOKEN')

def transform_status(status):
    int_list = ['active', 'failed', 'succeeded', 'terminating']
    string_list = ['start_time', 'completion_time', 'last_successful_time', 'name']
    string_map = {'name' : 'name', 'start_time' : 'startTime', 'completion_time' : 'completionTime', 'last_successful_time' : 'lastSuccessfulTime'}
    status_map = {}

    for key in int_list:
        if key in status:
            if status[key] == "None": status_map[key] = 0
            else: status_map[key] = status[key]
        else:
            status_map[key] = 0

    for key in string_list:
        if key in status: status_map[string_map[key]] = status[key]
        else: status_map[string_map[key]] = 'None'

    return status_map


def start(job=None):
    token = request.headers.get('Authorization').split(' ')[1]  
    
    if(auth != token):
        return jsonify({'authorized': False})
    else:
        k8s_jobs = JobControl()
        print("reached")
        args = [job.resource_type]
        if job.resource_type_only is False:
            args += ["-r", job.source_type]

        container = k8s_jobs.create_container(job.name, args)
        template = k8s_jobs.create_pod_template(job.name, container)
        job_obj = k8s_jobs.create_job(job.name, template)
        print("reached2")
        if job.periodic is True:
            cronjob_obj = k8s_jobs.create_cronjob(job.name, job_obj, job.time_period)
            raw_status = k8s_jobs.run_cronjob(cronjob_obj)
            status = transform_status(raw_status)
        else:
            raw_status = k8s_jobs.run_job(job_obj)
            status = transform_status(raw_status)
        print("reached3")
        return status


def list():
    k8s_jobs = JobControl()

    job_raw_list = k8s_jobs.get_jobs()
    cronjob_raw_list = k8s_jobs.get_cronjobs()

    job_list = [ transform_status(i) for i in job_raw_list ]
    cronjob_list = [ transform_status(i) for i in cronjob_raw_list ]

    return job_list + cronjob_list


def status(name, periodic):
    k8s_jobs = JobControl()

    if periodic is True:
        raw_status = k8s_jobs.get_cronjob_status(name)
        status = transform_status(raw_status)
    else:
        raw_status = k8s_jobs.get_job_status(name)
        status = transform_status(raw_status)

    return status


def delete(name, periodic):
    k8s_jobs = JobControl()

    if periodic is True:
        raw_status = k8s_jobs.delete_cronjob(name)
        status = transform_status(raw_status)
    else:
        raw_status = k8s_jobs.delete_job(name)
        status = transform_status(raw_status)

    return status


def update(name, job=None):
    k8s_jobs = JobControl()

    args = [job.resource_type]
    if job.resource_type_only is False:
        args += ["-r", job.source_type]

    container = k8s_jobs.create_container(job.name, args)
    template = k8s_jobs.create_pod_template(job.name, container)
    job_obj = k8s_jobs.create_job(job.name, template)

    if job.periodic is True:
        cronjob_obj = k8s_jobs.create_cronjob(job.name, job_obj, job.time_period)
        raw_status = k8s_jobs.update_cronjob(name, cronjob_obj)
        status = transform_status(raw_status)
    else:
        raw_status = k8s_jobs.update_job(name, job_obj)
        status = transform_status(raw_status)

    return status
