# ใช้ภาพ PHP ที่มี Apache ติดตั้งอยู่แล้ว
FROM php:8.1-apache

# คัดลอกไฟล์โปรเจกต์ไปที่ /var/www/html (โฟลเดอร์ของ Apache)
COPY . /var/www/html

# ตั้งค่าโฟลเดอร์ทำงาน
WORKDIR /var/www/html

# ติดตั้ง extensions ที่จำเป็น (ถ้าจำเป็น)
# RUN docker-php-ext-install pdo pdo_mysql

# เปิดพอร์ต 80
EXPOSE 80

# เริ่มเซิร์ฟเวอร์ Apache
CMD ["apache2-foreground"]
