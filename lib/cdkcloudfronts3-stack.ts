import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from "@aws-cdk/aws-route53-targets/lib";
import * as acm from "@aws-cdk/aws-certificatemanager";

export class Cdkcloudfronts3Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const PREFIX = id.toLowerCase().replace('stack', '')
    const BUCKET_NAME = PREFIX + '-bucket'
    const RECORD_NAME = 'bonsoir'
    const DOMAIN_NAME = 'figmentresearch.com'
    const CERTIFICATE_ARN = 'arn:aws:acm:us-east-1:0000000000:certificate/xxxxx......'

    const bucket = new s3.Bucket(this, 'bucket', {
      bucketName: BUCKET_NAME,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "error.html",
      publicReadAccess: true,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
          ],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          exposedHeaders: [],
          maxAge: 3000,
        },
      ],
    })
    
    const certificate = acm.Certificate.fromCertificateArn(this, 'certificate',
      CERTIFICATE_ARN
    )
    
    const distribution = new cloudfront.Distribution(this, 'distribution', {
      defaultBehavior: { 
        origin: new origins.S3Origin(bucket)
      },
      domainNames: [cdk.Fn.join(".", [RECORD_NAME, DOMAIN_NAME])],
      certificate: certificate,
    })
    
    const zone = route53.HostedZone.fromLookup(this, "zone", {
      domainName: DOMAIN_NAME,
    })
    
    const record = new route53.ARecord(this, "record", {
      recordName: RECORD_NAME,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone: zone,
    })
    
  }
}
