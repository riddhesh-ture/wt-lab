<%@ page language="java"
         contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Electricity Bill System</title>

    <style>

        /* ================================
           RESET
        ================================= */

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html,
        body {
            width: 100%;
            min-height: 100%;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            background: #0f172a;
            color: #334155;
            overflow-x: hidden;
        }


        /* ================================
           BACKGROUND
        ================================= */

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
            filter: blur(90px);
            opacity: .35;
        }

        .glow-one {
            width: 400px;
            height: 400px;
            background: #2563eb;
            top: -180px;
            left: -120px;
        }

        .glow-two {
            width: 350px;
            height: 350px;
            background: #06b6d4;
            right: -120px;
            top: 30%;
        }

        .glow-three {
            width: 400px;
            height: 400px;
            background: #7c3aed;
            bottom: -220px;
            left: 35%;
        }


        /* ================================
           MAIN CONTAINER
        ================================= */

        .main-container {
            position: relative;
            z-index: 2;

            width: min(1100px, 94%);
            min-height: 650px;

            margin: 40px auto;

            display: grid;
            grid-template-columns: 42% 58%;

            overflow: hidden;

            border-radius: 28px;

            background: white;

            box-shadow:
                0 30px 80px rgba(0, 0, 0, .45);
        }


        /* ================================
           LEFT PANEL
        ================================= */

        .left-panel {
            position: relative;

            padding: 55px 48px;

            color: white;

            overflow: hidden;

            background:
                linear-gradient(
                    145deg,
                    #1d4ed8,
                    #2563eb 50%,
                    #0891b2
                );
        }

        .left-panel::before {
            content: "";

            position: absolute;

            width: 420px;
            height: 420px;

            right: -250px;
            top: -190px;

            border-radius: 50%;

            border: 1px solid rgba(255,255,255,.15);
        }

        .left-panel::after {
            content: "";

            position: absolute;

            width: 500px;
            height: 500px;

            left: -380px;
            bottom: -330px;

            border-radius: 50%;

            border: 1px solid rgba(255,255,255,.12);
        }

        .left-content {
            position: relative;
            z-index: 2;
        }


        /* ================================
           LOGO
        ================================= */

        .logo {
            width: 72px;
            height: 72px;

            display: flex;
            align-items: center;
            justify-content: center;

            margin-bottom: 28px;

            border-radius: 20px;

            background: rgba(255,255,255,.15);
            border: 1px solid rgba(255,255,255,.25);

            font-size: 38px;

            box-shadow:
                0 15px 35px rgba(0,0,0,.18);

            animation: logoPulse 2s infinite;
        }

        @keyframes logoPulse {

            0%, 100% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.06);
            }
        }


        /* ================================
           BADGE
        ================================= */

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;

            padding: 8px 13px;

            margin-bottom: 20px;

            border-radius: 30px;

            background: rgba(255,255,255,.13);

            border: 1px solid rgba(255,255,255,.16);

            color: rgba(255,255,255,.92);

            font-size: 10px;
            font-weight: 700;

            letter-spacing: 1px;
        }

        .badge i {
            color: #a5f3fc;
            font-style: normal;
        }


        /* ================================
           LEFT HEADING
        ================================= */

        .left-panel h1 {
            font-size: 45px;
            line-height: 1.08;

            font-weight: 800;

            letter-spacing: -1.5px;

            margin-bottom: 20px;
        }

        .left-panel h1 span {
            display: block;
            color: #a5f3fc;
        }


        /* ================================
           DESCRIPTION
        ================================= */

        .description {
            max-width: 430px;

            color: rgba(255,255,255,.82);

            font-size: 14px;
            line-height: 1.8;

            margin-bottom: 35px;
        }


        /* ================================
           FEATURES
        ================================= */

        .features {
            display: flex;
            flex-direction: column;
            gap: 18px;
        }

        .feature {
            display: flex;
            align-items: center;

            gap: 13px;
        }

        .feature-icon {
            width: 44px;
            height: 44px;
            min-width: 44px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 12px;

            background: rgba(255,255,255,.14);

            border: 1px solid rgba(255,255,255,.1);

            font-size: 17px;
        }

        .feature strong {
            display: block;

            color: white;

            font-size: 13px;

            margin-bottom: 3px;
        }

        .feature span {
            display: block;

            color: rgba(255,255,255,.68);

            font-size: 10px;
        }


        /* ================================
           INFO BOX
        ================================= */

        .left-info {
            display: flex;
            align-items: flex-start;

            gap: 10px;

            margin-top: 32px;

            padding: 14px;

            border-radius: 13px;

            background: rgba(255,255,255,.10);

            border: 1px solid rgba(255,255,255,.14);

            color: rgba(255,255,255,.75);

            font-size: 10px;

            line-height: 1.6;
        }

        .left-info i {
            color: #a5f3fc;
            font-style: normal;
        }


        /* ================================
           RIGHT PANEL
        ================================= */

        .right-panel {
            padding: 38px;

            background: #f8fafc;
        }


        .calculator-card {
            width: 100%;

            padding: 32px;

            background: white;

            border-radius: 22px;

            box-shadow:
                0 12px 40px rgba(15,23,42,.08);
        }


        /* ================================
           HEADER
        ================================= */

        .card-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;

            gap: 15px;

            margin-bottom: 28px;
        }

        .section-label {
            display: block;

            color: #2563eb;

            font-size: 9px;
            font-weight: 700;

            letter-spacing: 1.5px;

            margin-bottom: 5px;
        }

        .card-header h2 {
            color: #0f172a;

            font-size: 25px;
            font-weight: 700;
        }

        .card-header h2 i {
            color: #2563eb;

            margin-right: 7px;

            font-style: normal;
        }


        /* ================================
           READY BADGE
        ================================= */

        .live-badge {
            display: flex;
            align-items: center;

            gap: 7px;

            padding: 7px 11px;

            border-radius: 20px;

            background: #ecfdf5;

            color: #059669;

            font-size: 8px;

            font-weight: 700;

            white-space: nowrap;
        }

        .live-badge span {
            width: 7px;
            height: 7px;

            border-radius: 50%;

            background: #10b981;

            box-shadow:
                0 0 0 4px rgba(16,185,129,.12);
        }


        /* ================================
           FORM
        ================================= */

        form {
            margin-bottom: 28px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;

            margin-bottom: 8px;

            color: #334155;

            font-size: 12px;

            font-weight: 600;
        }

        .form-group label i {
            color: #2563eb;

            margin-right: 6px;

            font-style: normal;
        }


        /* ================================
           INPUT
        ================================= */

        .input-box {
            height: 55px;

            display: flex;
            align-items: center;

            padding: 0 15px;

            border: 2px solid #e2e8f0;

            border-radius: 12px;

            background: white;

            transition: .25s;
        }

        .input-box:hover {
            border-color: #bfdbfe;
        }

        .input-box:focus-within {
            border-color: #2563eb;

            box-shadow:
                0 0 0 4px rgba(37,99,235,.08);
        }

        .input-box > i {
            color: #94a3b8;

            margin-right: 11px;

            font-size: 15px;

            font-style: normal;
        }

        .input-box input {
            width: 100%;
            height: 100%;

            border: none;
            outline: none;

            background: transparent;

            color: #0f172a;

            font-family: Arial, Helvetica, sans-serif;

            font-size: 14px;
        }

        .input-box input::placeholder {
            color: #94a3b8;
        }

        .unit-text {
            color: #64748b;

            font-size: 11px;

            font-weight: 600;
        }


        /* Remove number arrows */

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type="number"] {
            -moz-appearance: textfield;
        }


        /* ================================
           BUTTON
        ================================= */

        .calculate-btn {
            width: 100%;
            height: 56px;

            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 0 19px;

            border: none;

            border-radius: 12px;

            background:
                linear-gradient(
                    100deg,
                    #2563eb,
                    #06b6d4
                );

            color: white;

            font-family: Arial, Helvetica, sans-serif;

            font-size: 14px;

            font-weight: 700;

            cursor: pointer;

            box-shadow:
                0 12px 25px rgba(37,99,235,.25);

            transition: .25s;
        }

        .calculate-btn:hover {
            transform: translateY(-2px);

            box-shadow:
                0 16px 30px rgba(37,99,235,.32);
        }

        .calculate-btn:active {
            transform: translateY(0);
        }

        .calculate-btn span {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .calculate-btn i {
            font-style: normal;
        }


        /* ================================
           HOW IT WORKS
        ================================= */

        .tariff-section {
            padding-top: 25px;

            border-top: 1px solid #e2e8f0;
        }

        .tariff-header {
            margin-bottom: 12px;
        }

        .tariff-header h3 {
            color: #0f172a;

            font-size: 18px;
        }

        .tariff-header h3 i {
            color: #2563eb;

            margin-right: 6px;

            font-style: normal;
        }

        .tariff-description {
            margin-top: 6px;

            color: #64748b;

            font-size: 10px;

            line-height: 1.6;
        }


        /* ================================
           STEPS
        ================================= */

        .slab {
            min-height: 62px;

            display: flex;
            align-items: center;

            gap: 11px;

            margin-top: 9px;

            padding: 10px 12px;

            border: 1px solid #e2e8f0;

            border-radius: 12px;

            background: white;

            transition: .25s;
        }

        .slab:hover {
            transform: translateX(3px);

            box-shadow:
                0 7px 18px rgba(15,23,42,.06);
        }

        .slab-icon {
            width: 34px;
            height: 34px;
            min-width: 34px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 9px;

            font-size: 9px;
            font-weight: 700;
        }

        .slab-blue .slab-icon {
            background: #eff6ff;
            color: #2563eb;
        }

        .slab-cyan .slab-icon {
            background: #ecfeff;
            color: #0891b2;
        }

        .slab-purple .slab-icon {
            background: #f5f3ff;
            color: #7c3aed;
        }

        .slab-details {
            flex: 1;
        }

        .slab-details strong {
            display: block;

            color: #0f172a;

            font-size: 11px;
        }

        .slab-details small {
            display: block;

            color: #94a3b8;

            font-size: 9px;

            margin-top: 2px;
        }


        /* ================================
           FOOTER
        ================================= */

        .card-footer {
            display: flex;
            justify-content: space-between;

            gap: 10px;

            margin-top: 20px;

            padding-top: 15px;

            border-top: 1px solid #e2e8f0;

            color: #94a3b8;

            font-size: 8px;
        }

        .card-footer i {
            color: #10b981;

            margin-right: 4px;

            font-style: normal;
        }


        /* ================================
           TABLET
        ================================= */

        @media (max-width: 900px) {

            .main-container {
                width: 94%;

                grid-template-columns: 1fr;

                margin: 25px auto;
            }

            .left-panel {
                padding: 45px;
            }

            .right-panel {
                padding: 25px;
            }

        }


        /* ================================
           MOBILE
        ================================= */

        @media (max-width: 600px) {

            .main-container {
                width: 94%;

                margin: 15px auto;

                border-radius: 20px;
            }

            .left-panel {
                padding: 32px 24px;
            }

            .logo {
                width: 62px;
                height: 62px;

                font-size: 32px;

                border-radius: 17px;
            }

            .left-panel h1 {
                font-size: 34px;
            }

            .description {
                font-size: 12px;
            }

            .feature-icon {
                width: 40px;
                height: 40px;
                min-width: 40px;
            }

            .right-panel {
                padding: 12px;
            }

            .calculator-card {
                padding: 21px 16px;

                border-radius: 17px;
            }

            .card-header h2 {
                font-size: 21px;
            }

            .live-badge {
                font-size: 7px;
                padding: 6px 8px;
            }

            .card-footer {
                flex-direction: column;
                gap: 7px;
            }

        }


        /* ================================
           SMALL MOBILE
        ================================= */

        @media (max-width: 400px) {

            .left-panel h1 {
                font-size: 30px;
            }

            .calculator-card {
                padding: 18px 13px;
            }

            .card-header h2 {
                font-size: 19px;
            }

            .card-header {
                gap: 8px;
            }

        }

    </style>

</head>


<body>


    <!-- Background -->

    <div class="background">

        <div class="glow glow-one"></div>

        <div class="glow glow-two"></div>

        <div class="glow glow-three"></div>

    </div>


    <!-- Main Container -->

    <div class="main-container">


        <!-- ================================
             LEFT SIDE
        ================================= -->

        <div class="left-panel">

            <div class="left-content">


                <div class="logo">
                    ⚡
                </div>


                <div class="badge">

                    <i>●</i>

                    ELECTRICITY BILL SYSTEM

                </div>


                <h1>

                    Smart

                    <span>
                        Electricity
                    </span>

                    Billing

                </h1>


                <p class="description">

                    Enter your name and electricity units consumed
                    to generate your electricity bill quickly and easily.

                </p>


                <div class="features">


                    <div class="feature">

                        <div class="feature-icon">
                            ⚡
                        </div>

                        <div>

                            <strong>
                                Simple & Fast
                            </strong>

                            <span>
                                Enter your electricity consumption.
                            </span>

                        </div>

                    </div>


                    <div class="feature">

                        <div class="feature-icon">
                            ✓
                        </div>

                        <div>

                            <strong>
                                Easy to Use
                            </strong>

                            <span>
                                Simple and user-friendly system.
                            </span>

                        </div>

                    </div>


                    <div class="feature">

                        <div class="feature-icon">
                            ₹
                        </div>

                        <div>

                            <strong>
                                Bill Generation
                            </strong>

                            <span>
                                View your calculated bill instantly.
                            </span>

                        </div>

                    </div>


                </div>


                <div class="left-info">

                    <i>ℹ</i>

                    <span>

                        Enter your name and units consumed
                        to generate your electricity bill.

                    </span>

                </div>


            </div>

        </div>



        <!-- ================================
             RIGHT SIDE
        ================================= -->

        <div class="right-panel">

            <div class="calculator-card">


                <!-- Header -->

                <div class="card-header">

                    <div>

                        <span class="section-label">
                            WELCOME
                        </span>

                        <h2>

                            <i>⚡</i>

                            Electricity Bill

                        </h2>

                    </div>


                    <div class="live-badge">

                        <span></span>

                        READY

                    </div>

                </div>



                <!-- ================================
                     FORM
                ================================= -->

                <form action="${pageContext.request.contextPath}/ElectricityServlet"
                      method="post">


                    <!-- Name -->

                    <div class="form-group">

                        <label for="name">

                            <i>👤</i>

                            Customer Name

                        </label>


                        <div class="input-box">

                            <i>👤</i>

                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                autocomplete="name"
                                required>

                        </div>

                    </div>



                    <!-- Units -->

                    <div class="form-group">

                        <label for="units">

                            <i>⚡</i>

                            Units Consumed

                        </label>


                        <div class="input-box">

                            <i>⚡</i>

                            <input
                                type="number"
                                id="units"
                                name="units"
                                placeholder="Enter units consumed"
                                min="0"
                                step="1"
                                required>

                            <span class="unit-text">
                                kWh
                            </span>

                        </div>

                    </div>



                    <!-- Button -->

                    <button
                        type="submit"
                        class="calculate-btn">

                        <span>

                            <i>⚡</i>

                            Generate Bill

                        </span>

                        <i>→</i>

                    </button>


                </form>



                <!-- ================================
                     BASIC INFORMATION
                ================================= -->

                <div class="tariff-section">


                    <div class="tariff-header">

                        <h3>

                            <i>⚡</i>

                            How It Works

                        </h3>

                        <p class="tariff-description">

                            Enter your details and generate your
                            electricity bill in three simple steps.

                        </p>

                    </div>



                    <!-- Step 1 -->

                    <div class="slab slab-blue">

                        <div class="slab-icon">
                            01
                        </div>

                        <div class="slab-details">

                            <strong>
                                Enter Details
                            </strong>

                            <small>
                                Provide your name and units consumed.
                            </small>

                        </div>

                    </div>



                    <!-- Step 2 -->

                    <div class="slab slab-cyan">

                        <div class="slab-icon">
                            02
                        </div>

                        <div class="slab-details">

                            <strong>
                                Generate Bill
                            </strong>

                            <small>
                                The system calculates your electricity bill.
                            </small>

                        </div>

                    </div>



                    <!-- Step 3 -->

                    <div class="slab slab-purple">

                        <div class="slab-icon">
                            03
                        </div>

                        <div class="slab-details">

                            <strong>
                                View Result
                            </strong>

                            <small>
                                Your bill is displayed on the result page.
                            </small>

                        </div>

                    </div>



                    <!-- Footer -->

                    <div class="card-footer">

                        <span>

                            <i>✓</i>

                            Simple billing system

                        </span>


                        <span>

                            <i>✓</i>

                            Quick & convenient

                        </span>

                    </div>


                </div>


            </div>

        </div>


    </div>


</body>

</html>
