FROM python:3
 ENV PYTHONUNBUFFERED 1
 RUN mkdir /ComputingSEP-2019-16-security-application
 WORKDIR /ComputingSEP-2019-16-security-application
 ADD requirements.txt /ComputingSEP-2019-16-security-application/
 RUN pip install -r requirements.txt
 ADD . /ComputingSEP-2019-16-security-application/
