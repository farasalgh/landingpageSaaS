const Product = require('../models/product.model');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.createProduct = async (req, res) => {
    try {
        const productId = await Product.create(req.body);
        res.status(201).json({ message: 'Produk berhasil dibuat!', productId });
    } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.updateProduct = async (req, res) => {
    try {
        const success = await Product.update(req.params.id, req.body);
        if (success) res.status(200).json({ message: 'Produk berhasil diupdate!' });
        else res.status(404).json({ message: 'Produk tidak ditemukan.' });
    } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.deleteProduct = async (req, res) => {
    try {
        const success = await Product.delete(req.params.id);
        if (success) res.status(200).json({ message: 'Produk berhasil dihapus!' });
        else res.status(404).json({ message: 'Produk tidak ditemukan.' });
    } catch (error) { res.status(500).json({ message: 'Server error' }); }
};