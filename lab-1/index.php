<?php
$bill = "";
$units = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $units = (float)$_POST['units'];

    if ($units <= 50) {
        $bill = $units * 3.50;
    } elseif ($units <= 150) {
        $bill = (50 * 3.50) + (($units - 50) * 4.00);
    } elseif ($units <= 250) {
        $bill = (50 * 3.50) + (100 * 4.00) + (($units - 150) * 5.20);
    } else {
        $bill = (50 * 3.50) + (100 * 4.00) + (100 * 5.20) + (($units - 250) * 6.50);
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electricity Bill Calculator</title>
    <style>
        *{
            margin:0;
            padding:0;
            box-sizing:border-box;
            font-family:Arial,sans-serif;
        }

        body{
            display:flex;
            justify-content:center;
            align-items:center;
            min-height:100vh;
            background:linear-gradient(135deg,#74ebd5,#9face6);
            padding:20px;
        }

        .container{
            background:#fff;
            width:100%;
            max-width:400px;
            padding:25px;
            border-radius:12px;
            box-shadow:0 4px 10px rgba(0,0,0,0.2);
        }

        h2{
            text-align:center;
            margin-bottom:20px;
            color:#333;
        }

        label{
            font-weight:bold;
            color:#555;
        }

        input{
            width:100%;
            padding:10px;
            margin-top:8px;
            margin-bottom:15px;
            border:1px solid #ccc;
            border-radius:6px;
            font-size:16px;
        }

        button{
            width:100%;
            padding:12px;
            background:#4CAF50;
            color:#fff;
            border:none;
            border-radius:6px;
            font-size:16px;
            cursor:pointer;
        }

        button:hover{
            background:#45a049;
        }

        .result{
            margin-top:20px;
            padding:15px;
            background:#f1f8e9;
            border-left:5px solid #4CAF50;
            border-radius:6px;
        }

        @media(max-width:480px){
            .container{
                padding:20px;
            }
            h2{
                font-size:22px;
            }
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Electricity Bill Calculator</h2>

    <form method="post">
        <label>Enter Units Consumed</label>
        <input type="number" name="units" step="0.01" min="0"
               value="<?php echo htmlspecialchars($units); ?>" required>

        <button type="submit">Calculate Bill</button>
    </form>

    <?php if ($bill !== "") { ?>
        <div class="result">
            <p><strong>Units Consumed:</strong> <?php echo $units; ?></p>
            <p><strong>Total Electricity Bill:</strong>
                Rs. <?php echo number_format($bill, 2); ?>
            </p>
        </div>
    <?php } ?>
</div>

</body>
</html>