import connexion
import six

from swagger_server.models.job import Job  # noqa: E501
from swagger_server.models.status import Status  # noqa: E501
from swagger_server import util
from swagger_server.service.indexer_service import *


def get_job_status(name, periodic):  # noqa: E501
    """Get indexing job status

    Get the status of the job of the given name # noqa: E501

    :param name: the job name
    :type name: str
    :param periodic: if the job repeats
    :type periodic: bool

    :rtype: Status
    """
    return status(name, periodic)


def get_jobs():  # noqa: E501
    """Get indexing jobs

    Get list of running jobs # noqa: E501


    :rtype: List[Status]
    """
    return list()


def start_job(body=None):  # noqa: E501
    """Run indexing command

    Start indexing job with given parameters # noqa: E501

    :param body: Job to start
    :type body: dict | bytes

    :rtype: Status
    """
    if connexion.request.is_json:
        body = Job.from_dict(connexion.request.get_json())  # noqa: E501
        return start(body)
    return 500, 'error'


def stop_job(name, periodic):  # noqa: E501
    """Stop indexing command

    Delete indexing job with given name # noqa: E501

    :param name: the job name
    :type name: str
    :param periodic: if job repeats
    :type periodic: bool

    :rtype: str
    """
    return delete(name, periodic)


def update_job(name, body=None):  # noqa: E501
    """Update indexing job

    Update job with given name # noqa: E501

    :param name: the job name
    :type name: str
    :param body: Job update
    :type body: dict | bytes

    :rtype: Status
    """
    if connexion.request.is_json:
        body = Job.from_dict(connexion.request.get_json())  # noqa: E501
        return update(name, body)
    return 500, 'error'
