class CamionTipoDto {
  tipo: string;

  semirremolque: string;

  acoplado: string;
}

export class ConsultarUnidadesDto {
  unidadesOcupadas?: number[];
  camiones?: CamionTipoDto[];
}
