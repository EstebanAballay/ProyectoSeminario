import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { config } from '../config/env';
import axiosService from '../../api/axiosClient';

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  private readonly baseUrl = config.baseUrl;

  constructor() {}

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await axiosService.get(`${this.baseUrl}/${endpoint}`);
      const data = response.data;

      //Si es order,debo parsear el array que tiene los productos
      if (endpoint === 'order') {
        const data = {
          ...response.data,
          products: this.parseProductsArray(response.data.products)};
        }
      //En cualquier otro caso,no tengo que parsear nada
      else {
        const data = {
          ...response.data}
      }

      return data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }