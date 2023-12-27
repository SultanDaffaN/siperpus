package propensi.b04.siperpus.rest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class KategoriBukuPopular {
    Map<String, Integer> kategoriBukuPopular;
}
