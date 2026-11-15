<?php

namespace Modules\UserManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Modules\UserManagement\Http\Requests\UserRequest;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role')->orderBy('id')->paginate(10);

        return Inertia::render('UserManagement::index', ['users' => $users]);
    }

    public function create()
    {
        return Inertia::render('UserManagement::create');
    }

    public function store(UserRequest $request)
    {
        User::create($request->validated()); // password otomatis di-hash oleh cast 'hashed'

        return redirect()->route('users.index')->with('success', 'User berhasil ditambahkan.');
    }

    public function edit(User $user)
    {
        return Inertia::render('UserManagement::edit', [
            'user' => $user->only('id', 'name', 'email', 'role'),
        ]);
    }

    public function update(UserRequest $request, User $user)
    {
        $data = $request->validated();

        // password kosong = tidak diganti
        if (empty($data['password'])) {
            unset($data['password']);
        }

        // Admin tidak boleh menurunkan role akunnya sendiri
        if ($user->id === auth()->id()) {
            unset($data['role']);
        }

        $user->update($data);

        return redirect()->route('users.index')->with('success', 'User berhasil diubah.');
    }

    public function destroy(User $user)
    {
        // Admin tidak boleh menghapus akunnya sendiri
        if ($user->id === auth()->id()) {
            return redirect()->route('users.index')->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User berhasil dihapus.');
    }
}
