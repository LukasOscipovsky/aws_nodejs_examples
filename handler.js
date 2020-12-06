'use strict';
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})
const { v4: uuidv4 } = require('uuid')

const lukasTable = process.env.LUKAS_TABLE

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  }
}

function sortByDate(a, b) {
  return (a.createdAt > b.createdAt) ? -1 : 1
}

module.exports.createItem = (event, context, callback) => {
  const reqBody = JSON.parse(event.body)

  const post = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    userId: 1,
    title: reqBody.title,
    body: reqBody.body
  }

  return db.put({
    TableName: lukasTable,
    Item: post
  }).promise().then(() => {
    callback(null, response(201, post))
  }).catch(err => response(null, response(err.statuusCode, err)))
}


module.exports.getAllItems = (event, context, callback) => {
  return db.scan({
    TableName: lukasTable
  }).promise().then((res) => {
    callback(null, response(200, res.Items.sort(sortByDate)))
  }).catch(err => response(null, response(err.statuusCode, err)))
}

