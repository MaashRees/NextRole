find /usr/share/nginx/html -name "*.js" -exec \
  sed -i "s|__VITE_BACKEND_URI__|${VITE_BACKEND_URI}|g" {} \;

nginx -g "daemon off;"