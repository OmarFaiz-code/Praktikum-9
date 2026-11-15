<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    /**
     * Validasi dan buat user baru lewat fitur register bawaan Fortify.
     * Kolom 'role' DIISI 'user' secara paksa: input role dari form tidak dipercaya,
     * sehingga orang tidak bisa mendaftar sendiri sebagai admin.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name'     => ['required', 'string', 'max:100'],
            'email'    => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'required'  => ':attribute wajib diisi.',
            'email'     => 'Format email tidak valid.',
            'unique'    => ':attribute sudah terdaftar.',
            'min'       => ':attribute minimal :min karakter.',
            'confirmed' => 'Konfirmasi password tidak sama.',
        ], [
            'name' => 'Nama', 'email' => 'Email', 'password' => 'Password',
        ])->validate();

        return User::create([
            'name'     => $input['name'],
            'email'    => $input['email'],
            'password' => $input['password'], // di-hash otomatis oleh cast 'hashed'
            'role'     => 'user',
        ]);
    }
}
