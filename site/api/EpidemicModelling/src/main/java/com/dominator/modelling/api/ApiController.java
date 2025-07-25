package com.dominator.modelling.api;

import com.dominator.modelling.core.Epidemic;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.util.Pair;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;
import java.io.InputStream;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedDeque;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {
    @GetMapping("/long")
    public List<Long> getAllLong(){
        System.out.println("Відбувся Запит Лонг");
        List<Long> list = new ArrayList<>();
        list.add(100L);
        list.add(200L);
        return list;
    }

    private final static Deque<Epidemic> cache = new ConcurrentLinkedDeque<>();

    @GetMapping("/default/epidemic/st")
    public List<Pair<Double, Double>> getEpidemicST(){
        return getCache(100000, 0.02, 0.23, 0.045,0, 100, 1).st;
    }
    @GetMapping("/default/epidemic/it")
    public List<Pair<Double, Double>> getEpidemicIT(){
        return getCache(100000, 0.02, 0.23, 0.045,0, 100, 1).it;
    }
    @GetMapping("/default/epidemic/rt")
    public List<Pair<Double, Double>> getEpidemicRT(){
        return getCache(100000, 0.02, 0.23, 0.045,0, 100, 1).rt;
    }
    @GetMapping("/default/epidemic/is")
    public List<Pair<Double, Double>> getEpidemicIS(){
        return getCache(100000, 0.02, 0.23, 0.045,0, 100, 1).is;
    }
    @GetMapping("/default/epidemic/sr")
    public List<Pair<Double, Double>> getEpidemicSR(){
        return getCache(100000, 0.02, 0.23, 0.045,0, 100, 1).sr;
    }
    @GetMapping("/default/epidemic/r0")
    public Double getEpidemicR0(){
        return getCache(100000, 0.02, 0.23, 0.045,0, 100, 1).calculateBasicReproductiveNumber();
    }
    @GetMapping("/epidemic/max-inf")
    public Double getEpidemicMaxInfected(){
        return getCache(100000, 0.02, 0.23, 0.045,0, 100, 1).calculateMaxInfectedPopulationPercent();
    }

    @GetMapping("/population")
    public ResponseJsonPopulation getPopulationList(){
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream inputStream = new ClassPathResource("population.json").getInputStream();
            return mapper.readValue(inputStream, ResponseJsonPopulation.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping("/epidemic/st")
    public List<Pair<Double, Double>> getEpidemicST(@RequestBody RequestBodyEpidemic body){
        return getCache(body.pop, body.inf, body.betta, body.gamma,0, body.end, body.step).st;
    }
    @PostMapping("/epidemic/it")
    public List<Pair<Double, Double>> getEpidemicIT(@RequestBody RequestBodyEpidemic body){
        return getCache(body.pop, body.inf, body.betta, body.gamma,0, body.end, body.step).it;
    }
    @PostMapping("/epidemic/rt")
    public List<Pair<Double, Double>> getEpidemicRT(@RequestBody RequestBodyEpidemic body){
        return getCache(body.pop, body.inf, body.betta, body.gamma,0, body.end, body.step).rt;
    }
    @PostMapping("/epidemic/is")
    public List<Pair<Double, Double>> getEpidemicIS(@RequestBody RequestBodyEpidemic body){
        return getCache(body.pop, body.inf, body.betta, body.gamma,0, body.end, body.step).is;
    }
    @PostMapping("/epidemic/sr")
    public List<Pair<Double, Double>> getEpidemicSR(@RequestBody RequestBodyEpidemic body){
        return getCache(body.pop, body.inf, body.betta, body.gamma,0, body.end, body.step).sr;
    }
    @PostMapping("/epidemic/r0")
    public Double getEpidemicR0(@RequestBody RequestBodyEpidemic body){
        return getCache(body.pop, body.inf, body.betta, body.gamma,0, body.end, body.step).calculateBasicReproductiveNumber();
    }
    @PostMapping("/epidemic/max-inf")
    public Double getEpidemicMaxInfected(@RequestBody RequestBodyEpidemic body){
        return getCache(body.pop, body.inf, body.betta, body.gamma,0, body.end, body.step).calculateMaxInfectedPopulationPercent();
    }

    private void setCache(Epidemic epidemic){
        ApiController.cache.addFirst(epidemic);
        if(ApiController.cache.size()>5){
            ApiController.cache.removeLast();
        }
    }

    private Epidemic getCache(double population, double infectedZero, double betta, double gamma, double startTime, double endTime, double steep){
        Optional<Epidemic> ep = ApiController.cache.stream().filter(
                entry -> entry.equals(new Epidemic(population, infectedZero, betta, gamma).setData(startTime, endTime, steep))
        ).findFirst();

        Epidemic epidemic;
        if (ep.isPresent()){
            epidemic=ep.get();
        } else {
            epidemic = new Epidemic(population, infectedZero, betta, gamma).setData(startTime, endTime, steep).generatePairs();
            setCache(epidemic);
        }
        return  epidemic.hasData() ? epidemic : epidemic.setData(startTime, endTime, steep).generatePairs();
    }
}
