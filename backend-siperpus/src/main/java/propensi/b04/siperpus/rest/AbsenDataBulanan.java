package propensi.b04.siperpus.rest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AbsenDataBulanan {
    List<Integer> lstDataAbsen;
}
