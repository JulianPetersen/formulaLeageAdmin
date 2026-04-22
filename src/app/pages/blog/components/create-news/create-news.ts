import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BlogService } from '../../../../services/blog-service';

@Component({
  selector: 'app-create-news',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CKEditorModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './create-news.html',
  styleUrl: './create-news.scss',
})
export class createBlog {



  public editorConfig = {
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'blockQuote',
      'insertTable',
      'uploadImage',
      '|',
      'undo',
      'redo'
    ]
  };
  toolbar: [
    'undo', 'redo',
    '|',
    'heading',
    '|',
    'bold', 'italic',
    '|',
    'link',
    'insertTable',
    'uploadImage',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'blockQuote'
  ]
  image: {
    toolbar: [
      'imageTextAlternative',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side'
    ]
  }



  public Editor: any = ClassicEditor;
  form!: FormGroup;


  constructor(private fb: FormBuilder, private blogService: BlogService) {

    this.form = this.fb.group({
      title: ['', Validators.required],
      summary: ['', Validators.required],
      content: ['', Validators.required],
      published: [false],
      notify: [false]
    });

    this.form.get('published')?.valueChanges.subscribe(value => {
      if (!value) {
        this.form.get('notify')?.setValue(false);
      }
    });

  }



  save() {

    if (this.form.invalid) return;

    const blog = this.form.value;

    this.blogService.createBlog(blog).subscribe({
      next: () => {

        console.log('noticia creada');

        this.blogService.notifyBlogAdded();

        this.form.reset();

      },
      error: (err) => {
        console.error(err);
      }
    });

  }


  onReady(editor: any) {

    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {

      return {
        upload: async () => {

          const file = await loader.file;

          const response: any = await this.blogService.uploadImage(file).toPromise();

          return {
            default: response.url
          };

        }
      };

    };

  }

}


