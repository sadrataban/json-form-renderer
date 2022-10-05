import { PhotoService } from './../../services/photo.service';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Form from 'src/app/types/form.type';
import customValidator from 'src/app/validators/custom-validator';
import { Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { readBlobAsBase64 } from '@capacitor/core/types/core-plugins';
import { Platform } from '@ionic/angular';

const IMAGE_DIR = 'stored-images';

@Component({
  selector: 'app-json-form',
  templateUrl: './json-form.component.html',
  styleUrls: ['./json-form.component.scss'],
})
export class JsonFormComponent implements OnInit, OnChanges {
  jsonFormData: Form;
  form: FormGroup;
  currentStep = 1;

  constructor(
    private fb: FormBuilder,
    private photoService: PhotoService,
    private platform: Platform
  ) {
    this.form = fb.group({});

    this.jsonFormData = {
      id: '1',
      submitUri: 'http://localhost:8100',
      title: 'Test Form',
      steps: [
        {
          stepNumber: 1,
          items: [
            {
              key: 'item1',
              label: 'First Name',
              name: 'firstName',
              type: 'text',
              defaultValue: '',
              placeholder: 'First Name',
              nativeOptions: { cameraField: false, audioField: false },
              options: {},
              validation: { required: true, minLength: 3, maxLength: 5 },
              validators: [],
            },
            {
              key: 'item2',
              label: 'Last Name',
              name: 'lastName',
              type: 'text',
              defaultValue: '',
              placeholder: 'Last Name',
              nativeOptions: { cameraField: false, audioField: false },
              options: {},
              validation: { required: true, minLength: 3, maxLength: 5 },
              validators: [
                {
                  fieldKey: 'firstName',
                  fieldAttribute: 'value',
                  fieldAttributeChild: 'length',
                  condition: '>',
                  conditionValue: 1,
                },
              ],
            },
            {
              key: 'item3',
              label: 'Profile Picture',
              name: 'profilePicture',
              type: 'file',
              defaultValue: '',
              placeholder: 'Profile Picture',
              nativeOptions: { cameraField: true, audioField: false },
              options: {},
              validation: { required: true },
              validators: [],
            },
          ],
          canMoveOnInvalid: false,
          validators: [],
        },
      ],
      validators: [],
    };
  }
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    const firstStep = this.jsonFormData.steps[0];

    for (const item of firstStep.items) {
      const validators = [];
      Object.keys(item.validation).forEach((key) => {
        if (item.validation[key]) {
          switch (key) {
            case 'required':
              validators.push(Validators.required);
              break;
            case 'minLength':
              validators.push(Validators.minLength(item.validation[key]));
              break;
            case 'maxLength':
              validators.push(Validators.maxLength(item.validation[key]));
              break;
          }
        }
      });
      item.validators.forEach((validator) =>
        validators.push(customValidator(this.form, validator))
      );

      const control = new FormControl(item.defaultValue, validators);
      if (item.type === 'file') {
        control.valueChanges.subscribe((a) => console.log(a));
      }
      this.form.addControl(item.name, control);
    }
  }

  onSubmit() {
    console.log(this.form);
  }

  async onTakePhoto(controlKey: string) {
    const photo: Photo = await this.photoService.takeNewPhoto();
    const control = this.form.get(controlKey);

    if (photo) {
      const base64Data = await this.readBlobAsBase64(photo);
      const fileName = new Date().getTime() + '.jpeg';
      const savedFile = await Filesystem.writeFile({
        directory: Directory.Data,
        path: `${IMAGE_DIR}/${fileName}`,
        data: base64Data,
      });
      control.setValue(photo.webPath);

      console.log('saved file: ', savedFile);
    }
  }

  async readBlobAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({ path: photo.path });

      return file.data;
    } else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(blob);
    });
}
