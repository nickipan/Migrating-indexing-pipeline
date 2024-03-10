# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.job import Job  # noqa: E501
from swagger_server.models.status import Status  # noqa: E501
from swagger_server.test import BaseTestCase


class TestDefaultController(BaseTestCase):
    """DefaultController integration test stubs"""

    def test_get_job_status(self):
        """Test case for get_job_status

        Get indexing job status
        """
        response = self.client.open(
            '/NORASILVEN/indexer/1.0.0/job/{name}/{periodic}'.format(name='name_example', periodic=true),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_jobs(self):
        """Test case for get_jobs

        Get indexing jobs
        """
        response = self.client.open(
            '/NORASILVEN/indexer/1.0.0/jobs',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_start_job(self):
        """Test case for start_job

        Run indexing command
        """
        body = Job()
        response = self.client.open(
            '/NORASILVEN/indexer/1.0.0/jobs',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_stop_job(self):
        """Test case for stop_job

        Stop indexing command
        """
        response = self.client.open(
            '/NORASILVEN/indexer/1.0.0/job/{name}/{periodic}'.format(name='name_example', periodic=true),
            method='DELETE')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_job(self):
        """Test case for update_job

        Update indexing job
        """
        body = Job()
        response = self.client.open(
            '/NORASILVEN/indexer/1.0.0/job/{name}'.format(name='name_example'),
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
