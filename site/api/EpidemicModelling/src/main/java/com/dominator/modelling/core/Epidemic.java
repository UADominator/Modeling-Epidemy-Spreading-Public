package com.dominator.modelling.core;

import com.dominator.modelling.core.utils.MathUtils;
import org.springframework.data.util.Pair;

import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;

public class Epidemic {
    public final double population;
    public double susceptibleZero;
    public double infectedZero;;
    public double sigma;
    public double betta;
    public double gamma;
    public double startTime, endTime, steep;

    // Лісти які повертає апішка
    public List<Pair<Double, Double>> st = new LinkedList<>();
    public List<Pair<Double, Double>> it = new LinkedList<>();
    public List<Pair<Double, Double>> rt = new LinkedList<>();

    public List<Pair<Double, Double>> is = new LinkedList<>();
    public List<Pair<Double, Double>> sr = new LinkedList<>();


    /**
     * @param population - Початкове населення
     * @param infectedZero - Початково заражені
     * @param betta - коефіцієнт інтенсивності контактів індивідів з подальшим інфікуванням
     * @param gamma - Перехід від інфікованих до невразливих
     */
    public Epidemic(double population, double infectedZero, double betta, double gamma) {
        this.population = population;
        this.infectedZero = population * infectedZero;
        this.susceptibleZero = population - this.infectedZero;
        this.betta = betta;
        this.gamma = gamma;
        this.sigma = gamma / betta;

    }

    public double calculateBasicReproductiveNumber(){
        return betta * susceptibleZero / gamma;
    }

    public double calculateAverageUnwellDuration(){
        return 1.0 / gamma;
    }

    public double calculateMaxInfectedPopulationPercent(){
        return (1 - (1 / (betta / gamma)) * (1 - Math.log(1 / (betta / gamma)))) * population;
    }

    public Epidemic setData(double startTime, double endTime, double steep){
        this.startTime=startTime;
        this.endTime=endTime;
        this.steep= (startTime - endTime) / steep > 10_000 ? (startTime - endTime) / 10_000.0 : steep;
        return this;
    }
    public Epidemic generatePairs(){
        double time = startTime;
        double S = susceptibleZero / population;
        double I = infectedZero / population;
        double R = 0;


        while (time <= endTime) {
            st.add(Pair.of(MathUtils.round5(time), MathUtils.round5(S * population)));
            it.add(Pair.of(MathUtils.round5(time), MathUtils.round5(I * population)));
            rt.add(Pair.of(MathUtils.round5(time), MathUtils.round5(R * population)));

            double dSdt = -betta * S * I;
            double dIdt = betta * S * I - gamma * I;
            double dRdt = gamma * I;
            double dSdR = dSdt / dRdt;
            double dIdS = dIdt / dSdt;

            is.add(Pair.of(MathUtils.round(dIdS, 10), MathUtils.round(I * population, 10)));
            sr.add(Pair.of(MathUtils.round(dSdR, 10), MathUtils.round(S * population, 10)));

            S = (S + dSdt * steep);
            I = (I + dIdt * steep);
            R = (R + dRdt * steep);

            time += steep;
        }
        is.sort(Comparator.comparing(Pair::getFirst));
        sr.sort(Comparator.comparing(Pair::getFirst));

        return this;
    }

    public void test(){
        System.out.println("Basic Reproductive Number: " + this.calculateBasicReproductiveNumber());
        System.out.println("Average Unwell Duration (days): " + this.calculateAverageUnwellDuration());
        System.out.println("Max Infected Population: " + this.calculateMaxInfectedPopulationPercent());
    }

    public boolean equals(double population, double infectedZero, double betta, double gamma){
        return equals(new Epidemic(population, infectedZero, betta, gamma));
    }

    public boolean hasData(){
        return st != null && it != null && rt != null && is != null && sr != null;
    }
}