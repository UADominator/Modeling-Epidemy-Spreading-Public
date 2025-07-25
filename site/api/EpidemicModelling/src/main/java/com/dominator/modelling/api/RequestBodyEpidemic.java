package com.dominator.modelling.api;

public class RequestBodyEpidemic {
    public double pop;
    public double inf;
    public double betta;
    public double gamma;
    public double step;
    public double end;

    @Override
    public String toString() {
        return "RequestBody{" +
                "pop=" + pop +
                ", inf=" + inf +
                ", betta=" + betta +
                ", gamma=" + gamma +
                ", step=" + step +
                ", end=" + end +
                '}';
    }
}
