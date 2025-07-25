package com.dominator.modelling.api;

import java.util.List;

public class ResponseJsonPopulation {
    public List<Cities> cities;

    public static class Cities{
        public String city;
        public List<PopulationAtYear> population;

        public static class PopulationAtYear{
            public int year;
            public int population;
        }
    }
}
