# 잘못 올린 파일 삭제
// .idea/modules.xml 파일 삭제
$ git rm --cached .idea/modules.xml
// .idea 폴더 하위의 모든 파일 삭제 
$ git rm --cached -r .idea/

git rm --cached .env   

# 버전 관리에서도 제외
// 버전 관리에서 완전히 제외하기 위해서는 반드시 commit 명령어를 수행해야 한다.
$ git commit -m "Fixed untracked files"
// 원격 저장소(origin)에 push
$ git push origin master
https://gmlwjd9405.github.io/2018/05/17/git-delete-incorrect-files.html
