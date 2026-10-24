<%@ page language="java"
         contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<%
    /*
     * Values received from ElectricityServlet
     */

    String customerName = (String) request.getAttribute("name");

    Integer unitsObj = (Integer) request.getAttribute("units");

    Double billObj = (Double) request.getAttribute("bill");


    /*
     * Safety defaults
     */

    if (customerName == null) {
        customerName = "Customer";
    }

    int units = unitsObj != null ? unitsObj : 0;

    double bill = billObj != null ? billObj : 0.0;


    /*
     * Calculate slab-wise information
     */

    int slab1Units = Math.min(units, 50);

    int slab2Units = 0;

    int slab3Units = 0;

    int slab4Units = 0;


    if (units > 50) {

        slab2Units = Math.min(units - 50, 100);

    }


    if (units > 150) {

        slab3Units = Math.min(units - 150, 100);

    }


    if (units > 250) {

        slab4Units = units - 250;

    }


    /*
     * Slab amounts
     */

    double slab1Amount = slab1Units * 3.50;

    double slab2Amount = slab2Units * 4.00;

    double slab3Amount = slab3Units * 5.20;

    double slab4Amount = slab4Units * 6.50;


    /*
     * Determine current slab
     */

    int currentSlab;

    String currentSlabText;

    String currentRate;


    if (units <= 50) {

        currentSlab = 1;

        currentSlabText = "First 50 Units";

        currentRate = "₹3.50 / unit";

    }
    else if (units <= 150) {

        currentSlab = 2;

        currentSlabText = "Units 51 – 150";

        currentRate = "₹4.00 / unit";

    }
    else if (units <= 250) {

        currentSlab = 3;

        currentSlabText = "Units 151 – 250";

        currentRate = "₹5.20 / unit";

    }
    else {

        currentSlab = 4;

        currentSlabText = "Above 250 Units";

        currentRate = "₹6.50 / unit";

    }


    /*
     * Average price per unit
     */

    double averageRate = units > 0 ? bill / units : 0;


    /*
     * Current date
     */

    java.text.SimpleDateFormat dateFormat =
            new java.text.SimpleDateFormat("dd MMM yyyy, hh:mm a");

    String generatedDate = dateFormat.format(new java.util.Date());

%>


<!DOCTYPE html>

<html lang="en">


<head>


    <meta charset="UTF-8">


    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">


    <title>
        Electricity Bill Receipt
    </title>


    <!-- Google Font -->

    <link rel="preconnect"
          href="https://fonts.googleapis.com">

    <link rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet">


    <!-- Font Awesome -->

    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">


    <style>


        /* =====================================================
           RESET
        ===================================================== */

        * {

            margin: 0;

            padding: 0;

            box-sizing: border-box;

            font-family: "Poppins", sans-serif;

        }


        :root {

            --blue: #2563eb;

            --blue-dark: #1d4ed8;

            --cyan: #06b6d4;

            --purple: #7c3aed;

            --orange: #f97316;

            --green: #10b981;

            --dark: #0f172a;

            --text: #334155;

            --muted: #64748b;

            --border: #e2e8f0;

        }


        /* =====================================================
           BODY
        ===================================================== */

        body {

            min-height: 100vh;

            padding: 35px 15px;

            background:

                radial-gradient(
                    circle at 10% 10%,
                    rgba(37,99,235,.35),
                    transparent 28%
                ),

                radial-gradient(
                    circle at 90% 90%,
                    rgba(6,182,212,.25),
                    transparent 28%
                ),

                #0f172a;

            color: var(--text);

        }


        /* =====================================================
           BACKGROUND
        ===================================================== */

        .background {

            position: fixed;

            inset: 0;

            overflow: hidden;

            pointer-events: none;

            z-index: 0;

        }


        .glow {

            position: absolute;

            border-radius: 50%;

            filter: blur(100px);

            opacity: .35;

            animation: float 10s infinite alternate;

        }


        .glow-one {

            width: 400px;

            height: 400px;

            background: #2563eb;

            top: -150px;

            left: -100px;

        }


        .glow-two {

            width: 350px;

            height: 350px;

            background: #06b6d4;

            right: -100px;

            bottom: -100px;

        }


        @keyframes float {

            from {

                transform: translateY(0);

            }

            to {

                transform: translateY(45px);

            }

        }


        /* =====================================================
           MAIN RECEIPT
        ===================================================== */

        .receipt {

            width: min(1000px, 100%);

            margin: auto;

            position: relative;

            z-index: 5;

            background: #ffffff;

            border-radius: 28px;

            overflow: hidden;

            box-shadow:
                0 30px 80px rgba(0,0,0,.45);

        }


        /* =====================================================
           HEADER
        ===================================================== */

        .receipt-header {

            position: relative;

            padding: 35px 40px;

            color: white;

            background:
                linear-gradient(
                    110deg,
                    #1d4ed8,
                    #2563eb,
                    #06b6d4
                );

            overflow: hidden;

        }


        .receipt-header::after {

            content: "";

            position: absolute;

            width: 280px;

            height: 280px;

            right: -100px;

            top: -170px;

            border-radius: 50%;

            border: 1px solid rgba(255,255,255,.15);

        }


        .header-content {

            position: relative;

            z-index: 2;

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 20px;

        }


        .brand {

            display: flex;

            align-items: center;

            gap: 16px;

        }


        .brand-icon {

            width: 62px;

            height: 62px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 17px;

            background: rgba(255,255,255,.15);

            border: 1px solid rgba(255,255,255,.2);

            font-size: 30px;

        }


        .brand-text span {

            display: block;

            font-size: 9px;

            letter-spacing: 2px;

            font-weight: 600;

            color: rgba(255,255,255,.7);

            margin-bottom: 3px;

        }


        .brand-text h1 {

            font-size: 25px;

            font-weight: 700;

        }


        .paid-badge {

            display: flex;

            align-items: center;

            gap: 7px;

            padding: 9px 14px;

            border-radius: 30px;

            background: rgba(255,255,255,.15);

            border: 1px solid rgba(255,255,255,.2);

            font-size: 9px;

            font-weight: 700;

        }


        .paid-badge i {

            color: #86efac;

        }


        /* =====================================================
           CONTENT
        ===================================================== */

        .receipt-body {

            padding: 40px;

        }


        /* =====================================================
           CUSTOMER INFO
        ===================================================== */

        .customer-section {

            display: grid;

            grid-template-columns: 1fr 1fr;

            gap: 18px;

            margin-bottom: 35px;

        }


        .info-card {

            display: flex;

            align-items: center;

            gap: 13px;

            padding: 17px;

            border: 1px solid var(--border);

            border-radius: 15px;

            background: #f8fafc;

        }


        .info-icon {

            width: 43px;

            height: 43px;

            min-width: 43px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 12px;

            background: #eff6ff;

            color: var(--blue);

        }


        .info-label {

            display: block;

            color: #94a3b8;

            font-size: 9px;

            font-weight: 600;

            text-transform: uppercase;

            letter-spacing: .7px;

        }


        .info-value {

            display: block;

            margin-top: 2px;

            color: var(--dark);

            font-size: 13px;

            font-weight: 600;

        }


        /* =====================================================
           SUMMARY
        ===================================================== */

        .summary {

            display: grid;

            grid-template-columns: repeat(3, 1fr);

            gap: 15px;

            margin-bottom: 35px;

        }


        .summary-card {

            padding: 20px;

            border-radius: 16px;

            background: #f8fafc;

            border: 1px solid var(--border);

        }


        .summary-card .icon {

            width: 36px;

            height: 36px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 10px;

            margin-bottom: 12px;

        }


        .summary-card:nth-child(1) .icon {

            background: #eff6ff;

            color: var(--blue);

        }


        .summary-card:nth-child(2) .icon {

            background: #ecfeff;

            color: #0891b2;

        }


        .summary-card:nth-child(3) .icon {

            background: #f0fdf4;

            color: var(--green);

        }


        .summary-label {

            display: block;

            color: var(--muted);

            font-size: 9px;

            font-weight: 600;

        }


        .summary-value {

            display: block;

            color: var(--dark);

            font-size: 19px;

            font-weight: 700;

            margin-top: 3px;

        }


        /* =====================================================
           SECTION HEADING
        ===================================================== */

        .section-heading {

            display: flex;

            align-items: center;

            justify-content: space-between;

            margin-bottom: 15px;

        }


        .section-heading h2 {

            color: var(--dark);

            font-size: 19px;

        }


        .section-heading h2 i {

            color: var(--blue);

            margin-right: 7px;

        }


        .section-heading span {

            color: var(--muted);

            font-size: 9px;

        }


        /* =====================================================
           BILL TABLE
        ===================================================== */

        .table-container {

            overflow-x: auto;

            border: 1px solid var(--border);

            border-radius: 16px;

        }


        table {

            width: 100%;

            border-collapse: collapse;

            min-width: 650px;

        }


        thead {

            background: #f8fafc;

        }


        th {

            padding: 14px 17px;

            text-align: left;

            color: #64748b;

            font-size: 9px;

            text-transform: uppercase;

            letter-spacing: .6px;

            font-weight: 700;

            border-bottom: 1px solid var(--border);

        }


        td {

            padding: 17px;

            border-bottom: 1px solid #f1f5f9;

            font-size: 11px;

        }


        tbody tr:last-child td {

            border-bottom: none;

        }


        tbody tr {

            transition: background .2s;

        }


        tbody tr:hover {

            background: #f8fafc;

        }


        .slab-number {

            width: 30px;

            height: 30px;

            display: inline-flex;

            align-items: center;

            justify-content: center;

            border-radius: 9px;

            font-size: 8px;

            font-weight: 700;

        }


        .blue {

            background: #eff6ff;

            color: #2563eb;

        }


        .cyan {

            background: #ecfeff;

            color: #0891b2;

        }


        .purple {

            background: #f5f3ff;

            color: #7c3aed;

        }


        .orange {

            background: #fff7ed;

            color: #ea580c;

        }


        .slab-name strong {

            display: block;

            color: var(--dark);

            font-size: 11px;

        }


        .slab-name small {

            display: block;

            color: #94a3b8;

            font-size: 8px;

            margin-top: 2px;

        }


        .rate {

            font-weight: 600;

            color: #475569;

        }


        .amount {

            text-align: right;

            color: var(--dark);

            font-weight: 700;

        }


        .used-badge {

            display: inline-block;

            margin-left: 5px;

            padding: 3px 7px;

            border-radius: 10px;

            background: #dcfce7;

            color: #15803d;

            font-size: 7px;

            font-weight: 700;

        }


        /* =====================================================
           DISABLED SLABS
        ===================================================== */

        .disabled-row {

            opacity: .4;

        }


        /* =====================================================
           TOTAL
        ===================================================== */

        .total-section {

            display: flex;

            justify-content: flex-end;

            margin-top: 22px;

        }


        .total-box {

            width: 330px;

            padding: 22px;

            border-radius: 17px;

            color: white;

            background:
                linear-gradient(
                    120deg,
                    #1d4ed8,
                    #06b6d4
                );

            box-shadow:
                0 12px 28px rgba(37,99,235,.25);

        }


        .total-top {

            display: flex;

            align-items: center;

            justify-content: space-between;

            font-size: 10px;

            color: rgba(255,255,255,.75);

        }


        .total-amount {

            margin-top: 7px;

            font-size: 32px;

            font-weight: 800;

        }


        .total-note {

            margin-top: 5px;

            font-size: 8px;

            color: rgba(255,255,255,.65);

        }


        /* =====================================================
           CURRENT SLAB
        ===================================================== */

        .current-slab {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 15px;

            margin-top: 25px;

            padding: 17px 20px;

            border-radius: 15px;

            background: #eff6ff;

            border: 1px solid #dbeafe;

        }


        .current-left {

            display: flex;

            align-items: center;

            gap: 12px;

        }


        .current-icon {

            width: 40px;

            height: 40px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 11px;

            background: white;

            color: var(--blue);

        }


        .current-left strong {

            display: block;

            color: var(--dark);

            font-size: 11px;

        }


        .current-left span {

            display: block;

            margin-top: 2px;

            color: var(--muted);

            font-size: 8px;

        }


        .current-rate {

            color: var(--blue);

            font-size: 13px;

            font-weight: 700;

        }


        /* =====================================================
           FORMULA
        ===================================================== */

        .formula-section {

            margin-top: 30px;

            padding: 20px;

            border: 1px dashed #cbd5e1;

            border-radius: 16px;

            background: #fafafa;

        }


        .formula-title {

            color: var(--dark);

            font-size: 11px;

            font-weight: 700;

            margin-bottom: 12px;

        }


        .formula-title i {

            color: #f59e0b;

            margin-right: 5px;

        }


        .formula {

            display: flex;

            flex-wrap: wrap;

            align-items: center;

            gap: 8px;

        }


        .formula-item {

            padding: 7px 10px;

            border-radius: 8px;

            background: white;

            border: 1px solid var(--border);

            color: #475569;

            font-size: 9px;

            font-weight: 600;

        }


        .formula-plus {

            color: #94a3b8;

            font-size: 12px;

        }


        .formula-total {

            padding: 7px 11px;

            border-radius: 8px;

            background: #eff6ff;

            color: var(--blue);

            font-size: 10px;

            font-weight: 700;

        }


        /* =====================================================
           ACTION BUTTONS
        ===================================================== */

        .actions {

            display: flex;

            justify-content: center;

            gap: 12px;

            margin-top: 35px;

        }


        .btn {

            display: inline-flex;

            align-items: center;

            justify-content: center;

            gap: 8px;

            min-width: 170px;

            height: 48px;

            padding: 0 20px;

            border-radius: 11px;

            text-decoration: none;

            border: none;

            font-family: inherit;

            font-size: 11px;

            font-weight: 600;

            cursor: pointer;

            transition:
                transform .2s,
                box-shadow .2s;

        }


        .btn:hover {

            transform: translateY(-2px);

        }


        .btn-primary {

            color: white;

            background:
                linear-gradient(
                    100deg,
                    #2563eb,
                    #06b6d4
                );

            box-shadow:
                0 10px 20px rgba(37,99,235,.2);

        }


        .btn-secondary {

            color: #334155;

            background: white;

            border: 1px solid var(--border);

        }


        /* =====================================================
           FOOTER
        ===================================================== */

        .receipt-footer {

            padding: 18px 40px;

            text-align: center;

            background: #f8fafc;

            border-top: 1px solid var(--border);

            color: #94a3b8;

            font-size: 8px;

        }


        .receipt-footer i {

            color: var(--green);

            margin-right: 5px;

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 700px) {


            body {

                padding: 15px 8px;

            }


            .receipt {

                border-radius: 20px;

            }


            .receipt-header {

                padding: 25px 20px;

            }


            .header-content {

                align-items: flex-start;

            }


            .brand-icon {

                width: 50px;

                height: 50px;

                font-size: 23px;

            }


            .brand-text h1 {

                font-size: 19px;

            }


            .paid-badge {

                font-size: 7px;

                padding: 7px 9px;

            }


            .receipt-body {

                padding: 25px 18px;

            }


            .customer-section {

                grid-template-columns: 1fr;

            }


            .summary {

                grid-template-columns: 1fr;

            }


            .total-section {

                justify-content: stretch;

            }


            .total-box {

                width: 100%;

            }


            .current-slab {

                align-items: flex-start;

                flex-direction: column;

            }


            .actions {

                flex-direction: column;

            }


            .btn {

                width: 100%;

            }


            .receipt-footer {

                padding: 15px 20px;

            }

        }


        /* =====================================================
           PRINT
        ===================================================== */

        @media print {


            body {

                padding: 0;

                background: white;

            }


            .background {

                display: none;

            }


            .receipt {

                width: 100%;

                box-shadow: none;

                border-radius: 0;

            }


            .actions {

                display: none;

            }


            .receipt-footer {

                margin-top: 20px;

            }

        }

    </style>


</head>



<body>


<!-- =========================================================
     BACKGROUND
========================================================= -->

<div class="background">

    <div class="glow glow-one"></div>

    <div class="glow glow-two"></div>

</div>



<!-- =========================================================
     RECEIPT
========================================================= -->

<div class="receipt">


    <!-- =====================================================
         HEADER
    ====================================================== -->

    <header class="receipt-header">


        <div class="header-content">


            <div class="brand">


                <div class="brand-icon">

                    <i class="fa-solid fa-bolt"></i>

                </div>


                <div class="brand-text">

                    <span>

                        ELECTRICITY SERVICE

                    </span>

                    <h1>

                        Electricity Bill

                    </h1>

                </div>


            </div>


            <div class="paid-badge">

                <i class="fa-solid fa-circle-check"></i>

                CALCULATED

            </div>


        </div>


    </header>



    <!-- =====================================================
         BODY
    ====================================================== -->

    <main class="receipt-body">


        <!-- =================================================
             CUSTOMER DETAILS
        ================================================== -->

        <div class="customer-section">


            <div class="info-card">


                <div class="info-icon">

                    <i class="fa-solid fa-user"></i>

                </div>


                <div>

                    <span class="info-label">

                        Customer Name

                    </span>

                    <span class="info-value">

                        <%= customerName %>

                    </span>

                </div>


            </div>



            <div class="info-card">


                <div class="info-icon">

                    <i class="fa-regular fa-calendar"></i>

                </div>


                <div>

                    <span class="info-label">

                        Generated On

                    </span>

                    <span class="info-value">

                        <%= generatedDate %>

                    </span>

                </div>


            </div>


        </div>



        <!-- =================================================
             SUMMARY CARDS
        ================================================== -->

        <div class="summary">


            <div class="summary-card">


                <div class="icon">

                    <i class="fa-solid fa-bolt"></i>

                </div>


                <span class="summary-label">

                    Total Consumption

                </span>


                <span class="summary-value">

                    <%= units %> kWh

                </span>


            </div>



            <div class="summary-card">


                <div class="icon">

                    <i class="fa-solid fa-layer-group"></i>

                </div>


                <span class="summary-label">

                    Applied Slab

                </span>


                <span class="summary-value">

                    Slab <%= currentSlab %>

                </span>


            </div>



            <div class="summary-card">


                <div class="icon">

                    <i class="fa-solid fa-chart-line"></i>

                </div>


                <span class="summary-label">

                    Average Rate

                </span>


                <span class="summary-value">

                    ₹<%= String.format("%.2f", averageRate) %>

                </span>


            </div>


        </div>



        <!-- =================================================
             SLAB CALCULATION
        ================================================== -->

        <div class="section-heading">


            <h2>

                <i class="fa-solid fa-calculator"></i>

                Slab-wise Calculation

            </h2>


            <span>

                Progressive tariff

            </span>


        </div>



        <div class="table-container">


            <table>


                <thead>

                    <tr>

                        <th>Slab</th>

                        <th>Units</th>

                        <th>Rate / Unit</th>

                        <th>Calculation</th>

                        <th style="text-align:right;">

                            Amount

                        </th>

                    </tr>

                </thead>


                <tbody>


                    <!-- =====================================
                         SLAB 1
                    ====================================== -->

                    <tr class="<%= slab1Units == 0 ? "disabled-row" : "" %>">


                        <td>

                            <span class="slab-number blue">

                                01

                            </span>


                            <span class="used-badge">

                                <%= slab1Units > 0 ? "APPLIED" : "NOT USED" %>

                            </span>

                        </td>


                        <td>

                            <strong>

                                <%= slab1Units %>

                            </strong>

                            units

                        </td>


                        <td class="rate">

                            ₹3.50

                        </td>


                        <td>

                            <%= slab1Units %> × ₹3.50

                        </td>


                        <td class="amount">

                            ₹<%= String.format("%.2f", slab1Amount) %>

                        </td>


                    </tr>



                    <!-- =====================================
                         SLAB 2
                    ====================================== -->

                    <tr class="<%= slab2Units == 0 ? "disabled-row" : "" %>">


                        <td>

                            <span class="slab-number cyan">

                                02

                            </span>


                            <span class="used-badge">

                                <%= slab2Units > 0 ? "APPLIED" : "NOT USED" %>

                            </span>

                        </td>


                        <td>

                            <strong>

                                <%= slab2Units %>

                            </strong>

                            units

                        </td>


                        <td class="rate">

                            ₹4.00

                        </td>


                        <td>

                            <%= slab2Units %> × ₹4.00

                        </td>


                        <td class="amount">

                            ₹<%= String.format("%.2f", slab2Amount) %>

                        </td>


                    </tr>



                    <!-- =====================================
                         SLAB 3
                    ====================================== -->

                    <tr class="<%= slab3Units == 0 ? "disabled-row" : "" %>">


                        <td>

                            <span class="slab-number purple">

                                03

                            </span>


                            <span class="used-badge">

                                <%= slab3Units > 0 ? "APPLIED" : "NOT USED" %>

                            </span>

                        </td>


                        <td>

                            <strong>

                                <%= slab3Units %>

                            </strong>

                            units

                        </td>


                        <td class="rate">

                            ₹5.20

                        </td>


                        <td>

                            <%= slab3Units %> × ₹5.20

                        </td>


                        <td class="amount">

                            ₹<%= String.format("%.2f", slab3Amount) %>

                        </td>


                    </tr>



                    <!-- =====================================
                         SLAB 4
                    ====================================== -->

                    <tr class="<%= slab4Units == 0 ? "disabled-row" : "" %>">


                        <td>

                            <span class="slab-number orange">

                                04

                            </span>


                            <span class="used-badge">

                                <%= slab4Units > 0 ? "APPLIED" : "NOT USED" %>

                            </span>

                        </td>


                        <td>

                            <strong>

                                <%= slab4Units %>

                            </strong>

                            units

                        </td>


                        <td class="rate">

                            ₹6.50

                        </td>


                        <td>

                            <%= slab4Units %> × ₹6.50

                        </td>


                        <td class="amount">

                            ₹<%= String.format("%.2f", slab4Amount) %>

                        </td>


                    </tr>


                </tbody>


            </table>

        </div>



        <!-- =================================================
             TOTAL
        ================================================== -->

        <div class="total-section">


            <div class="total-box">


                <div class="total-top">

                    <span>

                        TOTAL ELECTRICITY BILL

                    </span>

                    <i class="fa-solid fa-indian-rupee-sign"></i>

                </div>


                <div class="total-amount">

                    ₹<%= String.format("%.2f", bill) %>

                </div>


                <div class="total-note">

                    Calculated according to the applicable
                    progressive slab rates.

                </div>


            </div>


        </div>



        <!-- =================================================
             CURRENT SLAB
        ================================================== -->

        <div class="current-slab">


            <div class="current-left">


                <div class="current-icon">

                    <i class="fa-solid fa-gauge-high"></i>

                </div>


                <div>

                    <strong>

                        Current Applied Slab

                    </strong>


                    <span>

                        <%= currentSlabText %>

                    </span>

                </div>


            </div>


            <div class="current-rate">

                <%= currentRate %>

            </div>


        </div>



        <!-- =================================================
             FORMULA
        ================================================== -->

        <div class="formula-section">


            <div class="formula-title">

                <i class="fa-solid fa-lightbulb"></i>

                How your bill was calculated

            </div>


            <div class="formula">


                <% if (slab1Units > 0) { %>

                    <div class="formula-item">

                        <%= slab1Units %> × ₹3.50

                    </div>


                    <% if (slab2Units > 0 || slab3Units > 0 || slab4Units > 0) { %>

                        <span class="formula-plus">+</span>

                    <% } %>

                <% } %>



                <% if (slab2Units > 0) { %>

                    <div class="formula-item">

                        <%= slab2Units %> × ₹4.00

                    </div>


                    <% if (slab3Units > 0 || slab4Units > 0) { %>

                        <span class="formula-plus">+</span>

                    <% } %>

                <% } %>



                <% if (slab3Units > 0) { %>

                    <div class="formula-item">

                        <%= slab3Units %> × ₹5.20

                    </div>


                    <% if (slab4Units > 0) { %>

                        <span class="formula-plus">+</span>

                    <% } %>

                <% } %>



                <% if (slab4Units > 0) { %>

                    <div class="formula-item">

                        <%= slab4Units %> × ₹6.50

                    </div>


                    <span class="formula-plus">

                        =

                    </span>

                <% } %>



                <div class="formula-total">

                    ₹<%= String.format("%.2f", bill) %>

                </div>


            </div>


        </div>



        <!-- =================================================
             ACTION BUTTONS
        ================================================== -->

        <div class="actions">


            <a href="index.jsp"
               class="btn btn-primary">

                <i class="fa-solid fa-arrow-left"></i>

                Calculate Again

            </a>


            <button type="button"
                    class="btn btn-secondary"
                    onclick="window.print()">

                <i class="fa-solid fa-print"></i>

                Print Bill

            </button>


        </div>


    </main>



    <!-- =====================================================
         FOOTER
    ====================================================== -->

    <footer class="receipt-footer">

        <i class="fa-solid fa-circle-check"></i>

        This bill was generated automatically using
        progressive electricity slab rates.

    </footer>


</div>



</body>

</html>
