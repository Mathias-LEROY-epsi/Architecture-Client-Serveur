#############################
#           DEV
#############################

# Use an official Python runtime as a parent image
FROM python:3.10 as dev

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY ./server/requirements.txt /app/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Run app.py when the container launches
CMD ["python", "app.py"]


#############################
#           PROD
#############################

# Use an official Python runtime as a parent image
FROM python:3.10 as prod

# Set the working directory to /app
WORKDIR /app

# Copy the rest of the application code into the container at /app
COPY ./server /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Expose the port that the application will run on
EXPOSE 8080

# Start the Gunicorn server
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]