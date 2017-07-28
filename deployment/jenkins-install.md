##Copy/paste into shell
sudo yum install -y epel-release
sudo yum -y update
sudo sed -i 's/enforcing/disabled/g' /etc/selinux/config /etc/selinux/config

##Copy/paste into shell
sudo reboot
sudo yum install -y java-1.8.0-openjdk.x86_64 wget
sudo cp /etc/profile /etc/profile_backup
echo 'export JAVA_HOME=/usr/lib/jvm/jre-1.8.0-openjdk' | sudo tee -a /etc/profile
echo 'export JRE_HOME=/usr/lib/jvm/jre' | sudo tee -a /etc/profile
source /etc/profile
echo $JAVA_HOME
echo $JRE_HOME
cd ~
sudo wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat-stable/jenkins.repo
sudo rpm --import http://pkg.jenkins-ci.org/redhat-stable/jenkins-ci.org.key
sudo yum install -y jenkins
sudo systemctl start jenkins.service
sudo systemctl enable jenkins.service
sudo firewall-cmd --zone=public --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
sudo yum install -y nginx nano

##Copy/paste into shell
sudo nano /etc/nginx/nginx.conf

#match this nginx config demo in above file;;;;;
#location / {
#   proxy_pass http://127.0.0.1:8080;
#    proxy_redirect off;
#    proxy_set_header Host $host;
#    proxy_set_header X-Real-IP $remote_addr;
#    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#    proxy_set_header X-Forwarded-Proto $scheme;
#}

##Copy/paste into shell
sudo systemctl start nginx.service
sudo systemctl enable nginx.service
sudo firewall-cmd --zone=public --permanent --add-service=http
sudo firewall-cmd --reload

#copy/paste into shell, copy output
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
#navigate to ip address, paste above output into login form

#Create SSH key on jenkins server and add key to github
sudo ssh-keygen
cat ~/.ssh/id_rsa.pub
