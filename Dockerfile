# Use an official Python runtime as a parent image
FROM python:3.10-alpine3.16 as server

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY ./server /app

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Run app.py when the container launches
CMD ["python", "app.py"]