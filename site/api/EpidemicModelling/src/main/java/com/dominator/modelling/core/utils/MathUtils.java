package com.dominator.modelling.core.utils;

public class MathUtils {
    public static double round5(double number){
        return round(number, 5);
    }
    public static double round(double number){
        return round(number, 2);
    }
    public static double round(double number, double numbers){
        return Math.round(number * Math.pow(10, numbers)) / Math.pow(10, numbers);
    }
}
