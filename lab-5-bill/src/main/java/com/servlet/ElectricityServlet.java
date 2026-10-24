package com.servlet;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@WebServlet("/ElectricityServlet")
public class ElectricityServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;


    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {


        // =====================================================
        // CHARACTER ENCODING
        // =====================================================

        request.setCharacterEncoding("UTF-8");

        response.setContentType("text/html;charset=UTF-8");


        // =====================================================
        // GET FORM VALUES
        // =====================================================

        String name = request.getParameter("name");

        String unitsInput = request.getParameter("units");


        // =====================================================
        // BASIC VALIDATION
        // =====================================================

        if (name == null || name.trim().isEmpty()) {

            request.setAttribute(
                    "error",
                    "Please enter your name."
            );

            request.getRequestDispatcher("index.jsp")
                   .forward(request, response);

            return;
        }


        if (unitsInput == null || unitsInput.trim().isEmpty()) {

            request.setAttribute(
                    "error",
                    "Please enter electricity units."
            );

            request.getRequestDispatcher("index.jsp")
                   .forward(request, response);

            return;
        }


        // =====================================================
        // PARSE UNITS
        // =====================================================

        int units;

        try {

            units = Integer.parseInt(unitsInput);

        }
        catch (NumberFormatException e) {

            request.setAttribute(
                    "error",
                    "Please enter a valid whole number for units."
            );

            request.getRequestDispatcher("index.jsp")
                   .forward(request, response);

            return;
        }


        // =====================================================
        // NEGATIVE VALUE CHECK
        // =====================================================

        if (units < 0) {

            request.setAttribute(
                    "error",
                    "Electricity units cannot be negative."
            );

            request.getRequestDispatcher("index.jsp")
                   .forward(request, response);

            return;
        }


        // =====================================================
        // ELECTRICITY BILL CALCULATION
        // =====================================================

        double bill = 0.0;


        /*
         * SLAB 1
         *
         * First 50 units
         * Rate = ₹3.50 per unit
         */

        if (units <= 50) {

            bill = units * 3.50;

        }


        /*
         * SLAB 2
         *
         * First 50 units = ₹3.50
         * Units 51-150 = ₹4.00
         */

        else if (units <= 150) {

            bill =
                    (50 * 3.50)
                    +
                    ((units - 50) * 4.00);

        }


        /*
         * SLAB 3
         *
         * First 50 units = ₹3.50
         * Next 100 units = ₹4.00
         * Units 151-250 = ₹5.20
         */

        else if (units <= 250) {

            bill =
                    (50 * 3.50)
                    +
                    (100 * 4.00)
                    +
                    ((units - 150) * 5.20);

        }


        /*
         * SLAB 4
         *
         * First 50 units = ₹3.50
         * Next 100 units = ₹4.00
         * Next 100 units = ₹5.20
         * Above 250 units = ₹6.50
         */

        else {

            bill =
                    (50 * 3.50)
                    +
                    (100 * 4.00)
                    +
                    (100 * 5.20)
                    +
                    ((units - 250) * 6.50);

        }


        // =====================================================
        // SEND DATA TO RESULT JSP
        // =====================================================

        request.setAttribute(
                "name",
                name.trim()
        );


        request.setAttribute(
                "units",
                units
        );


        request.setAttribute(
                "bill",
                bill
        );


        // =====================================================
        // FORWARD TO RESULT PAGE
        // =====================================================

        request.getRequestDispatcher("result.jsp")
               .forward(request, response);

    }


    // =========================================================
    // OPTIONAL: HANDLE GET REQUEST
    // =========================================================

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.sendRedirect("index.jsp");

    }

}
