<html>

<head>
    <title>This is a loop</title>
</head>

<body>

<?php
for ($i = 0; $i < 10; $i++) {
    echo "<p>Hello World</p>";
}

$a = 0;
do {
    echo "$a<br>";
    $a++;
} while ($a <= 10);

$b=0;
while($b<10){
    echo "$b<br>";
    $b++;

}
$c=0;
while($c<5){
switch ($c) {
    case '1':
        echo "hello<br>";
        break;
    case '2':
        echo "hell<br>";
        break;
    case '3':
        echo "hel<br>";
        break;
    
    default:
        
        break;
    
}$c++;
}
?>



</body>

</html>