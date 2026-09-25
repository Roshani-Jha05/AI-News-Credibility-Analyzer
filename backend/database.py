import mysql.connector


def get_database_connection():
    connection = mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="shiv",
        database="ai_news_credibility"
    )

    return connection