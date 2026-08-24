import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/bill")
public class ElectricityBillServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        double units = Double.parseDouble(request.getParameter("units"));
        double bill;

        if (units <= 50) {
            bill = units * 3.50;
        } else if (units <= 150) {
            bill = (50 * 3.50) + ((units - 50) * 4.00);
        } else if (units <= 250) {
            bill = (50 * 3.50) + (100 * 4.00) + ((units - 150) * 5.20);
        } else {
            bill = (50 * 3.50) + (100 * 4.00)
                 + (100 * 5.20) + ((units - 250) * 6.50);
        }

        out.println("<html><body style='font-family:Arial;text-align:center;padding-top:50px;'>");
        out.println("<h2>Electricity Bill Result</h2>");
        out.println("<p>Units Consumed: <b>" + units + "</b></p>");
        out.println("<p>Total Bill: <b>Rs. "
                + String.format("%.2f", bill) + "</b></p>");
        out.println("<a href='index.html'>Calculate Again</a>");
        out.println("</body></html>");
    }
}