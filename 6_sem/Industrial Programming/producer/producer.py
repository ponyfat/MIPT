import pika
import sys

connection = pika.BlockingConnection(pika.URLParameters('amqp://guest:guest@localhost:32769'))
channel = connection.channel()

channel.queue_declare(queue='rabbitMQ')

input_string = sys.stdin.read()
channel.basic_publish(exchange='',
                      routing_key='rabbitMQ',
                      body=input_string)
connection.close()
