FROM influxdb:1.8

ADD ./scripts /docker-entrypoint-initdb.d

ENV INFLUXDB_HTTP_AUTH_ENABLED=true

# TODO: This should be moved outside of the build
ENV INFLUXDB_ADMIN_USER=admin
ENV INFLUXDB_ADMIN_PASSWORD=pollbuddy

