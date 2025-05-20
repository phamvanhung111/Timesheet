import random
from datetime import datetime, timedelta
import mysql.connector


# Hàm tạo dữ liệu giả
def generate_checkin_data(start_date, end_date, user_id):
    data = []
    current_date = start_date

    # Tạo danh sách các ngày trong tháng
    days_in_month = [
        (start_date + timedelta(days=i))
        for i in range((end_date - start_date).days + 1)
        if (start_date + timedelta(days=i)).weekday() not in [5, 6]
    ]

    # Chọn 3 ngày ngẫu nhiên cho việc đi trễ
    late_days = random.sample(days_in_month, 3)

    while current_date <= end_date:
        weekday = current_date.weekday()  # 0: Thứ Hai, 6: Chủ Nhật

        if weekday in [5, 6]:  # Thứ Bảy hoặc Chủ Nhật
            check_in = "00:00:00"
        else:
            if current_date in late_days:
                # Random giờ, phút, giây từ 08:31:00 đến 10:30:00
                hour = random.randint(8, 10)
                if hour == 8:
                    minute = random.randint(31, 59)  # Từ 8:31 - 8:59
                elif hour == 10:
                    minute = random.randint(0, 30)  # Từ 10:00 - 10:30
                else:
                    minute = random.randint(0, 59)  # Từ 9:00 - 9:59
            else:
                # Random giờ, phút, giây từ 08:00:00 đến 08:30:00
                hour = 8
                minute = random.randint(0, 30)  # Từ 8:00 - 8:30

            second = random.randint(0, 59)  # Ngẫu nhiên giây
            check_in = f"{hour:02}:{minute:02}:{second:02}"

        data.append((user_id, current_date.strftime("%Y-%m-%d"), check_in))
        current_date += timedelta(days=1)  # Tăng lên 1 ngày

    return data


# Kết nối MySQL
def connect_to_database():
    try:
        connection = mysql.connector.connect(
            host="localhost",  # Thay bằng host của bạn
            user="root",  # Thay bằng username của bạn
            password="123456",  # Thay bằng mật khẩu của bạn
            database="tsadmin",  # Thay bằng tên database của bạn
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None


# Chèn dữ liệu vào MySQL
def insert_checkin_data(connection, data):
    try:
        cursor = connection.cursor()
        sql_insert_query = """
            INSERT INTO CheckIn (UserId, Date, CheckIn)
            VALUES (%s, %s, %s)
        """
        cursor.executemany(sql_insert_query, data)
        connection.commit()
        print(f"{cursor.rowcount} rows inserted successfully!")
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()


# Tạo dữ liệu giả
start_date = datetime(2024, 12, 1)
end_date = datetime(2024, 12, 31)
user_id = 9
fake_data = generate_checkin_data(start_date, end_date, user_id)

# Kết nối và chèn dữ liệu
connection = connect_to_database()
if connection:
    insert_checkin_data(connection, fake_data)
    connection.close()
