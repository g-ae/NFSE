FROM postgres:17
EXPOSE 5432
COPY init.sql /docker-entrypoint-initdb.d/
VOLUME /var/lib/postgresql/