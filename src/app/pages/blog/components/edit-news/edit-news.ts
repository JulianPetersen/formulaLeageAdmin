import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../../services/blog-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Header } from '../../../../shared/header/header';
import { Toolbar } from '../../../../shared/toolbar/toolbar';
import { MenuLateral } from '../../../../shared/menu-lateral/menu-lateral';


@Component({
  selector: 'app-edit-news',
  imports: [CommonModule,
    ReactiveFormsModule,
    CKEditorModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    Header,
    Toolbar,
    MenuLateral
    ],
  templateUrl: './edit-news.html',
  styleUrl: './edit-news.scss',
})
export class EditNews {
 form!: FormGroup;
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
    'undo','redo',
    '|',
    'heading',
    '|',
    'bold','italic',
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


constructor(
  private fb: FormBuilder,
  private route: ActivatedRoute,
  private blogService: BlogService
) {

  this.form = this.fb.group({
  title: [''],
  summary: [''],
  content: [''],
  published: [false]
});

}


blogId!: string;

ngOnInit() {

  this.blogId = this.route.snapshot.paramMap.get('id')!;

  this.blogService.getBlogById(this.blogId)
    .subscribe(blog => {

      this.form.patchValue({
        title: blog.title,
        summary: blog.summary,
        content: blog.content,
        published: blog.published
      });

    });

}



save() {

  if (this.form.invalid) return;

  this.blogService
    .updateBlog(this.form.value, this.blogId)
    .subscribe(() => {

      console.log('Blog actualizado');

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
