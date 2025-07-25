package com.dominator.EpidemicModelling;

import com.dominator.modelling.EpidemicModellingApplication;
import com.dominator.modelling.core.Epidemic;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = EpidemicModellingApplication.class)
class EpidemicModellingApplicationTests {
	
    @Test
    void contextLoads() {
//        Epidemic epidemic = new Epidemic(45000000, 0.053f, 0.056, 0.045); // beta gamma для коронавірусу https://pmc.ncbi.nlm.nih.gov/articles/PMC7570398/
        Epidemic epidemic = new Epidemic(1000000, 0.02, 0.056, 0.045);
        epidemic.setData(0, 100, 1).generatePairs();
        epidemic.test();

        System.out.println(epidemic.st);
//        System.out.println(epidemic.it);
//        System.out.println(epidemic.rt);
    }
}
