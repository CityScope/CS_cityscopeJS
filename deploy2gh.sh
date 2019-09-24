# #!/bin/bash
# clear dist folder 
sudo rm -rf dist
# build the dist for public url 
sudo parcel build index.html --public-url https://cityscope.media.mit.edu/CS_cityscopeJS/
# make sure to add dist to commit if .gitignored 
git add dist -f
#commit the GH pages changes 
git commit -m "gh-pages commit"
#push dist folder to subtree remote [Force overwtire all] 
git push origin `git subtree split --prefix dist master`:gh-pages --force
# finally remove dist from git 
# sudo git rm -r --cached --ignore-unmatch dist
# sudo rm -r  dist