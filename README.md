# Random-Screenshots
Nativescript vue app android/ios Showing u random screenshots from https://prnt.sc/

Download From: [Play Store](https://play.google.com/store/apps/details?id=ge.any.RandomScreenshot)

![first screen](https://lh3.googleusercontent.com/QeG1XmwVRF50Zs4vyTauyzmItLYa_EfMa_uhA76xtEWM-CyopW67nqgxthcfgq86iCg=w1920-h969-rw)
![gallery screen](https://lh3.googleusercontent.com/3H0Sef0z7lIdpTh4SVtR05dEwxU5MmzM4gXgPAfs5V9XxRbr2v3zoo8YNbEqb2BqyA=w1920-h969-rw)

```
Git clone https://github.com/kakha13/Random-Screenshots.git

npm install -g nativescript // install nativescript vue 

tns run // debuging for device
tns preview // debuging with Nativescript Preview app
```
For more information please visit : https://nativescript-vue.org/en/docs/getting-started/installation/

#If you want to use server side service.
Change "https://yourwebsite.ge/screen/" url with your domain name in files. Home.vue and List.vue

# You need to make files

add.php
list.php

# list.php content is:
```
header('Content-Type: application/json');
include("config.php");
$sql = 'SELECT * FROM screens order by id desc';
$res2 = mysqli_query($conn, $sql); 

$data = $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
echo json_encode($data);
```

# add.php content is:
```
header('Content-Type: application/json');
include("config.php");
$post = file_get_contents('php://input');

$data = json_decode($post);
$category = $data->category;
$image = $data->image;
$selectSql = "SELECT * FROM `screens` WHERE url = '$image'";

$result = mysqli_query($conn, $selectSql);


if (mysqli_num_rows($result) > 0) {
	echo json_encode(array("response"=>"Image already exists!"));
} else {
  $sql = "INSERT INTO `screens` (`id`, `url`,`category`) VALUES (NULL,  '$image','$category')";
  mysqli_query($conn, $sql); 	
  echo json_encode(array("response"=>"Your image has been successfully saved, now you cant see it in gallery."));
}
```
