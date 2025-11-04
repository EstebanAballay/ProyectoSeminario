class CamionTipoDto {
  tipo: string;
  semirremolque: string;
  acoplado: string;
}

export class ConsultarUnidadesDto {
  camiones: CamionTipoDto[];
}