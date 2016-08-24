# Simple Logging Service - Storage Microservice

This is a microservice that subscribes to a queue or pubsub channel hosted on 

* Redis 
* RabbitMQ
* Apache Kafka 

and writes the data to either

* Cloudant/CouchDB
* MongoDB
* ElasticSearch

It uses the bulk write APIs of each database for maximum efficiency.

Environment variables are used to determine which message hub and which database to use.

## Deploy to IBM Bluemix

### One-Click Deployment

The fastest way to deploy this application to Bluemix is to click this **Deploy to Bluemix** button. Or, if you prefer working from the command line, skip to the **Deploy Manually** section.

[![Deploy to Bluemix](https://deployment-tracker.mybluemix.net/stats/858af67e6e2d2aa21bcb4ecfbfa00524/button.svg)](https://bluemix.net/deploy?repository=https://github.com/ibm-cds-labs/simple-logging-storage)

**Don't have a Bluemix account?** If you haven't already, you'll be prompted to sign up for a Bluemix account when you click the button.  Sign up, verify your email address, then return here and click the the **Deploy to Bluemix** button again. Your new credentials let you deploy to the platform and also to code online with Bluemix and Git. If you have questions about working in Bluemix, find answers in the [Bluemix Docs](https://www.ng.bluemix.net/docs/).

### Deploy Manually to Bluemix

#### Configure Cloud Foundry

If you haven't already, [install the Cloud Foundry command line interface and connect to Bluemix](https://www.ng.bluemix.net/docs/#starters/install_cli.html).

#### Deploy

To deploy to Bluemix, simply:

    $ cf push

> **Note:** You may notice that Bluemix assigns a URL to your application containing a random word. This is defined in the `manifest.yml` file where the `random-route` key set to the value of `true`. This ensures that multiple people deploying this application to Bluemix do not run into naming collisions. To specify your own route, remove the `random-route` line from the `manifest.yml` file and add a `host` key with the unique value you would like to use for the host name.

_**Privacy Notice:**_ _This web application includes code to track deployments to [IBM Bluemix](https://www.bluemix.net/) and other Cloud Foundry platforms. Tracking helps us measure our samples' usefulness, so we can continuously improve the content we offer to you. The following information is sent to a [Deployment Tracker](https://github.com/cloudant-labs/deployment-tracker) service on each deployment:_

* _Application Name (`application_name`)_
* _Space ID (`space_id`)_
* _Application Version (`application_version`)_
* _Application URIs (`application_uris`)_

_This data is collected from the `VCAP_APPLICATION` environment variable in IBM Bluemix and other Cloud Foundry platforms. IBM uses this data to track metrics around deployments of sample applications to Bluemix._

_To disable deployment tracking, remove the following line from `server.js`:_

```
require("cf-deployment-tracker-client").track();
```

_Once that line is removed, you may also uninstall the `cf-deployment-tracker-client` npm package._

## Local Installation

Clone this repository and then run

```
npm install
```

## Usage

Set your environment variables and start up the app e.g.

```
export QUEUE_TYPE=redis_queue
export DATABASE_TYPE=cloudant
node app.js
```

When running in Bluemix, the service credentials will be discovered automatically from the Bluemix VCAP_SERVICES environment variable, but you must still specify the QUEUE_TYPE and DATABASE_TYPE you want using custom environment variabless.

## Environment variables

### QUEUE_TYPE

One of 

* redis_queue - A Redis list data structure
* redis_pubsub - A Redis PubSub channel
* rabbit_queue - A RabbitMQ PUSH/WORKER queue
* rabbit_pubsub - A RabbitMQ PUBLISH/SUBSCRIBE channel
* kafka - An Apache Kafka topic
* null - default (does nothing)

### QUEUE_NAME

The name of the queue/channel that is subscribed to. If omitted, it takes the following values for each of the queue types:

1. stdout - n/a
2. redis_queue - mcqueue
3. redis_pubsub - mcpubsub
4. rabbit_queue - mcqueue
5. rabbit_pubsub - mcpubsub
6. kafka - mcqueue

### DATABASE_TYPE

* stdout - (default) writes the data to the console only
* cloudant - An IBM Cloudant NoSQL database
* mongodb - A MongoDB database
* elasticsearch - An ElasticSearch engine

### DATABASE_NAME

The name of the Cloudant database to write to. Also defines to the MongoDB database and collection, and the ElasticSearch database and type. Defaults to "mc".

### BUFFER_SIZE

The number of documents to be written in one operation. Defaults to 50.

### PARALLELISM

The number if parallel writes that the are made to the database. Defaults to 5.

### VCAP_SERVICES

`VCAP_SERVICES` is created for you by the Bluemix Cloud Foundry service. It defines the credentials of the attached services that this app can connect to. 



