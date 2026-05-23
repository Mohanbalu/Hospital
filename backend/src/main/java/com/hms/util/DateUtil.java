package com.hms.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class DateUtil {

    private static final DateTimeFormatter DEFAULT_FORMATTER =
            DateTimeFormatter.ofPattern(AppConstants.DEFAULT_DATE_TIME_PATTERN);

    private DateUtil() {
    }

    public static LocalDateTime now() {
        return LocalDateTime.now();
    }

    public static String format(LocalDateTime dateTime) {
        return dateTime.format(DEFAULT_FORMATTER);
    }

    public static LocalDateTime parse(String value) {
        return LocalDateTime.parse(value, DEFAULT_FORMATTER);
    }
}