package com.odctalent.odctalent_backend.util;

import com.odctalent.odctalent_backend.entity.Apprenant;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ExcelHelper {

    public static List<Apprenant> excelToApprenants(InputStream is, String promotion) {
        try {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            List<Apprenant> apprenants = new ArrayList<>();
            int rowNumber = 0;

            while (rows.hasNext()) {
                Row currentRow = rows.next();

                if (rowNumber == 0) { // Ignorer la ligne d'en-tête
                    rowNumber++;
                    continue;
                }

                Iterator<Cell> cellsInRow = currentRow.iterator();
                Apprenant apprenant = new Apprenant();
                apprenant.setPromotion(promotion);

                int cellIdx = 0;
                while (cellsInRow.hasNext()) {
                    Cell currentCell = cellsInRow.next();

                    switch (cellIdx) {
                        case 0 -> apprenant.setNom(getCellValueAsString(currentCell));
                        case 1 -> apprenant.setPrenom(getCellValueAsString(currentCell));
                        case 2 -> apprenant.setEmail(getCellValueAsString(currentCell));
                        case 3 -> apprenant.setTelephone(getCellValueAsString(currentCell));
                        default -> {}
                    }
                    cellIdx++;
                }

                if (apprenant.getEmail() != null && !apprenant.getEmail().isBlank()) {
                    apprenants.add(apprenant);
                }
            }

            workbook.close();
            return apprenants;
        } catch (Exception e) {
            throw new RuntimeException("Échec du traitement du fichier Excel : " + e.getMessage());
        }
    }

    private static String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        CellType cellType = cell.getCellType();
        if (cellType == CellType.STRING) {
            return cell.getStringCellValue().trim();
        } else if (cellType == CellType.NUMERIC) {
            return String.valueOf((long) cell.getNumericCellValue());
        }
        return "";
    }
}