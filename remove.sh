git update-ref -d refs/original/refs/heads/master
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d
