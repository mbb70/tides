yarn run build && \
git checkout gh-pages && \
rm -rf static && \
cp -rf build/* . && \
git add -A && \
git commit -m 'update' && \
git push && \
git checkout main
