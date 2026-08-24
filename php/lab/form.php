<html>

<head>
    <title>Student Form</title>
</head>

<body>

<form method="post">

ID:
<input type="number" name="id"><br><br>
NAME:
<input type="text" name="name"><br><br>
DOB:
<input type="date" name="dob"><br><br>
BRANCH:
<input type="text" name="branch"><br><br>
SUBMIT:
<button type="submit" name="save">Save</button>



</form>

<?php

$conn = mysqli_connect("localhost", "root", "", "student");

if(isset($_POST['save']))
{
    $id = $_POST['id'];
    $name = $_POST['name'];
    $dob = $_POST['dob'];
    $branch = $_POST['branch'];

    $sql = "INSERT INTO stud VALUES('$id','$name','$dob','$branch')";

    if(mysqli_query($conn,$sql))
        echo "Inserted";
    else
        echo "Error";
}

?>

</body>

</html>