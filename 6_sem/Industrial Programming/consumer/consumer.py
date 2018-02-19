import pika
import tinydb
import time

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

db = tinydb.TinyDB('/db/db.json')

channel.queue_declare(queue='rabbitMQ')


def callback(ch, method, properties, body):
    db.insert({'timestamp': time.time(), 'message': body})


channel.basic_consume(callback,
                      queue='rabbitMQ',
                      no_ack=True)
channel.start_consuming()