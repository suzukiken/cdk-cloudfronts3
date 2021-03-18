#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Cdkcloudfronts3Stack } from '../lib/cdkcloudfronts3-stack';

const app = new cdk.App();
new Cdkcloudfronts3Stack(app, 'Cdkcloudfronts3Stack', { env: {
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION
}});