FROM grafana/grafana:latest

COPY ./provisioning /etc/grafana/provisioning
COPY ./config.ini /etc/grafana/grafana.ini
COPY ./dashboards /var/lib/grafana/dashboards

ENV REPORTING_DB_NAME=pollbuddy
ENV REPORTING_DB_USERNAME=pollbuddy
ENV REPORTING_DB_PASSWORD=pollbuddy