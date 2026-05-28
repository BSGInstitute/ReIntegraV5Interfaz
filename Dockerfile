# dist/ pre-compilado por CI — Docker solo sirve el artefacto
FROM nginx:1.27-alpine
COPY dist/integra-v5-interfaz /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:80/ || exit 1
