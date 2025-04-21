package g06.ecnu.heartbridge.utils;

import java.util.regex.Pattern;

/**
 * <p>
 * 检测一个字符串是邮箱/电话/用户名
 * </p>
 *
 * @author Tennsai Minamoto
 * @since 2025/3/19
 */
public class PatternValidator {
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private static final Pattern PHONE_PATTERN =
            Pattern.compile("^1\\d{10}$"); // 1开头的11位数字

    private static final Pattern USERNAME_PATTERN =
            Pattern.compile("^(?!\\d+$)[A-Za-z0-9_]+$"); // 不能是纯数字，必须包含字母或下划线

    public static String validatePattern(String input) {
        if (EMAIL_PATTERN.matcher(input).matches()) {
            return "EMAIL";
        } else if (PHONE_PATTERN.matcher(input).matches()) {
            return "PHONE";
        } else if (USERNAME_PATTERN.matcher(input).matches()) {
            return "USERNAME";
        }
        return "INVALID";
    }
}
